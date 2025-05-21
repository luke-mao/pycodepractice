import signal
import sys
from testcase import user_submission, test_cases


# Timeout handler
def timeout_handler(signum, frame):
    raise TimeoutError("Timeout!")


# Register the timeout signal
signal.signal(signal.SIGALRM, timeout_handler)

results = []

for i, case in enumerate(test_cases):
    inputs, expected = case["input"], case["expected"]

    try:
        signal.alarm(5)
        result = user_submission(*inputs)
        # for successful cases, disable the alarm
        signal.alarm(0)

        if result == expected:
            results.append(f"Case {i + 1}: Passed")
        else:
            results.append(f"Case {i + 1}: Failed (Expected: {expected}, Got: {result})")

    except TimeoutError:
        results.append(f"Case {i + 1}: Timeout!")
    except Exception as e:
        results.append(f"Case {i + 1}: Error {e}")

# Print the results
for result in results:
    print(result)
