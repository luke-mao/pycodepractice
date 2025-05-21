"""
Executes user-submitted code in an isolated Docker container for automated problem evaluation.

- Builds a temporary environment with the user's code and test cases.
- Measures execution time and memory usage.
- Returns test results, timing, and memory statistics.
"""

import docker
import shutil
import os
import re
from flask import current_app
from datetime import datetime

from config import db
from tables import *

run_script = r"""
import signal
import sys
from testcase import user_submission, test_cases

# Timeout handler
def timeout_handler(signum, frame):
    raise TimeoutError("Timeout!")

signal.signal(signal.SIGALRM, timeout_handler)

results = []

for i, case in enumerate(test_cases):
    inputs, expected = case["input"], case["expected"]
    try:
        signal.alarm(5)
        result = user_submission(*inputs)
        signal.alarm(0)

        if result == expected:
            results.append(f"Case {i + 1}: Passed")
        else:
            if i < 3:
                results.append(
                    f"Case {i + 1}: Failed, Input: {inputs}, Expected: {expected}, Got: {result}"
                )
            else:
                results.append(f"Case {i + 1}: Failed, Hidden Params")

    except TimeoutError:
        results.append(f"Case {i + 1}: Timeout!")
    except Exception as e:
        results.append(f"Case {i + 1}: Error {e}")

for r in results:
    print(r)
"""

dockerfile_script = r"""
FROM python:3.10-slim-time
WORKDIR /app
COPY . /app
"""


def sandbox_eval(submission_id):
    submission = Submission.query.get(submission_id)
    problem = Problem.query.get(submission.problem_id)

    # User's code
    user_code = submission.code

    # Get the testcase path: e.g. /uploads/problem1/testcase.py
    testcase_url = os.path.join(
        current_app.config["UPLOAD_FOLDER"], problem.folder_url, "testcase.py"
    )

    # Create a unique folder in the UPLOAD_FOLDER
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    folder = os.path.join(current_app.config["UPLOAD_FOLDER"], timestamp)
    os.mkdir(folder)

    # Write submission.py
    with open(os.path.join(folder, "submission.py"), "w") as f:
        f.write(user_code)

    # Copy testcase.py
    shutil.copy(testcase_url, os.path.join(folder, "testcase.py"))

    # Write run.py
    with open(os.path.join(folder, "run.py"), "w") as f:
        f.write(run_script)

    # Write Dockerfile
    with open(os.path.join(folder, "Dockerfile"), "w") as f:
        f.write(dockerfile_script)

    # Build a unique tag to avoid name collisions
    image_tag = f"python-sandbox-{timestamp}"

    client = docker.from_env()

    try:
        # Build the image
        image, build_logs = client.images.build(
            path=os.path.abspath(folder), tag=image_tag
        )

        # Run the container using time + memory usage
        # /usr/bin/time -p logs real/user/sys lines
        # then cat memory usage from cgroup
        command_str = (
            "sh -c '/usr/bin/time -p python3 run.py && "
            "echo memory $(cat /sys/fs/cgroup/memory/memory.usage_in_bytes 2>/dev/null || cat /sys/fs/cgroup/memory.current)'"
        )

        container = client.containers.run(
            image=image_tag,
            command=command_str,
            stdout=True,
            stderr=True,
            detach=True,
            mem_limit="2g",
        )

        # Wait for it to finish and fetch logs
        container.wait()
        logs = container.logs().decode("utf-8", errors="replace")

        # print the logs
        # example: Case 0: Passed\nCase 1: Passed\nCase 2: Passed\nreal 0.05\nuser 0.02\nsys 0.00\n1499136\n
        # extract the "real 0.05" and "1499136" lines
        # print(logs)

        # extract the Cases sentence, real time, and memory usage
        output = re.findall(r"Case \d+.*", logs)

        real_time = re.search(r"real\s+(\d+\.\d+)", logs)
        real_time = float(real_time.group(1)) if real_time else None

        # ram is the last line
        mem_match = re.search(r"memory\s+(\d+)", logs)
        ram = int(mem_match.group(1)) / 1024 / 1024 if mem_match else None
        ram = round(ram, 2) if ram else None

        # remove the container, image, and folder
        container.remove()
        client.images.remove(image=image_tag, force=True)
        shutil.rmtree(folder)

        return True, output, real_time, ram
    except Exception as e:
        # If build or run failed, return error info
        return False, str(e), None, None
