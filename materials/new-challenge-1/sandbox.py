import docker
import shutil
import tempfile
import os
import re

submission_path = "submission.py"
testcase_path = "testcase.py"
run_path = "run.py"

# create a temporary directory
with tempfile.TemporaryDirectory() as temp_dir:
    # copy the submission, testcase, and run script to the temporary directory
    shutil.copy(submission_path, os.path.join(temp_dir, "submission.py"))
    shutil.copy(testcase_path, os.path.join(temp_dir, "testcase.py"))
    shutil.copy(run_path, os.path.join(temp_dir, "run.py"))
    # print("Files inside temp_dir:", os.listdir(temp_dir))

    # create a docker client
    client = docker.from_env()

    # run the docker container, capture the output
    # use: python 3.10-slim
    # cpu core limit: 1
    # memory limit: 2GB
    # mount the temporary directory to /app
    # command: python run.py
    # capture all the stdout and stderr,
    # detach = True will run the container in the background
    try:
        # Run the Docker container with resource limits and capture the output
        container = client.containers.run(
            "python:3.10-slim-time",
            volumes={temp_dir: {"bind": "/app", "mode": "rw"}},
            working_dir="/app",
            command="sh -c '/usr/bin/time -p python3 run.py && echo memory $(cat /sys/fs/cgroup/memory/memory.usage_in_bytes 2>/dev/null || cat /sys/fs/cgroup/memory.current)'",
            stdout=True,
            stderr=True,
            detach=True,
            mem_limit="1g",
        )

        # by using detach = True, needs to wait for the container to finish
        container.wait()

        # logs
        # example: Case 0: Passed\nCase 1: Passed\nCase 2: Passed\nreal 0.05\nuser 0.02\nsys 0.01\nmemory 8298496\n
        # !! notice: the memory line may not always be the last line, sometimes it's before the time lines
        logs = container.logs().decode("utf-8")
        # print(logs)
        # print("----------------------")
        # print(logs.replace("\n", r"\n"))
        # print("----------------------")

        # extract the lines starting with: Case \d+
        cases = re.findall(r"Case \d+.*", logs)
        for c in cases:
            print(c)

        # get the real time
        real_time = re.findall(r"real (\d+\.\d+)", logs)[0]
        print(f"Real Time: {real_time} s")

        # get the memory usage
        mem_match = re.search(r"memory\s+(\d+)", logs)
        ram = int(mem_match.group(1)) / 1024 / 1024 if mem_match else None
        ram = round(ram, 2) if ram else None
        print(f"Memory Usage: {ram:.2f} MB")

        # remove the container
        container.remove()

    except docker.errors.ContainerError as e:
        print(f"Error: {e.stderr.decode('utf-8')}")
    except docker.errors.ImageNotFound:
        print(
            "Error: Docker image not found. Make sure 'python:3.10-slim' is available."
        )
    except docker.errors.APIError as e:
        print(f"Docker API error: {e}")
