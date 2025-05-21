# Import the user-defined function from submission.py
from submission import threeSum as user_submission

# Define the test cases as a list of dictionaries
test_cases = [
    {"input": ([-1, 0, 1, 2, -1, -4],), "expected": [[-1, -1, 2], [-1, 0, 1]]},
    {"input": ([],), "expected": []},
    {"input": ([0, 0, 0],), "expected": [[0, 0, 0]]},
    {"input": ([1, 2, 3, 4],), "expected": []},
    {"input": ([-2, 0, 1, 1, 2],), "expected": [[-2, 0, 2], [-2, 1, 1]]},
    {
        "input": ([3, 0, -2, -1, 1, 2],),
        "expected": [[-2, -1, 3], [-2, 0, 2], [-1, 0, 1]],
    },
    {"input": ([-100000, 50000, 50000],), "expected": [[-100000, 50000, 50000]]},
    {"input": ([1, -1, -1, 0],), "expected": [[-1, 0, 1]]},
    {"input": ([1, 2, -2, -1],), "expected": []},
    {"input": ([0, 1, 2, 3],), "expected": []},
]
