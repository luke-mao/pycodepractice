# Import the user-defined function from submission.py
from submission import isPalindrome as user_submission

# Define the test cases as a list of dictionaries
test_cases = [
    {"input": (121,), "expected": True},
    {"input": (-121,), "expected": False},
    {"input": (10,), "expected": False},
    {"input": (0,), "expected": True},
    {"input": (5,), "expected": True},
    {"input": (12344321,), "expected": True},
    {"input": (100,), "expected": False},
    {"input": (-1,), "expected": False},
    {"input": (9999,), "expected": True},
    {"input": (123321,), "expected": True},
]
