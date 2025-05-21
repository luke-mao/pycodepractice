# Import the user-defined function from submission.py
from submission import isValid as user_submission

# Define the test cases as a list of dictionaries
test_cases = [
    {"input": ("()[]{}",), "expected": True},
    {"input": ("(]",), "expected": False},
    {"input": ("([{}])",), "expected": True},
    {"input": ("({[)]}",), "expected": False},
    {"input": ("{[]}",), "expected": True},
    {"input": ("",), "expected": True},  # Empty string
    {"input": ("(",), "expected": False},  # Single bracket
    {"input": ("(((((",), "expected": False},  # Unbalanced opening brackets
    {"input": ("())",), "expected": False},  # Extra closing bracket
    {"input": ("[({})](())",), "expected": True},  # Multiple levels
]
