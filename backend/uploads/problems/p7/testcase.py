# Import the user-defined function from submission.py
from submission import climbStairs as user_submission

# Define the test cases as a list of dictionaries
test_cases = [
    {"input": (1,), "expected": 1},
    {"input": (2,), "expected": 2},
    {"input": (3,), "expected": 3},
    {"input": (4,), "expected": 5},
    {"input": (5,), "expected": 8},
    {"input": (6,), "expected": 13},
    {"input": (10,), "expected": 89},
    {"input": (15,), "expected": 987},
    {"input": (20,), "expected": 10946},
    {"input": (30,), "expected": 1346269},
]
