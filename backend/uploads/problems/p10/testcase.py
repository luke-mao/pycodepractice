# Import the user-defined function from submission.py
from submission import fib as user_submission

# Define the test cases as a list of dictionaries
test_cases = [
    {"input": (0,), "expected": 0},
    {"input": (1,), "expected": 1},
    {"input": (2,), "expected": 1},
    {"input": (3,), "expected": 2},
    {"input": (5,), "expected": 5},
    {"input": (10,), "expected": 55},
    {"input": (15,), "expected": 610},
    {"input": (20,), "expected": 6765},
    {"input": (25,), "expected": 75025},
    {"input": (30,), "expected": 832040},
]
