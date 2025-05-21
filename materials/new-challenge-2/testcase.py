# Import the user-defined function from submission.py
# keep the line 3 as it is
from submission import most_frequent_char as user_submission

# Define the test cases as a list of dictionaries
test_cases = [
    {"input": ("apple",), "expected": "p"},
    {"input": ("banana",), "expected": "a"},
    {"input": ("abcde",), "expected": "a"},
    {"input": ("zzzzz",), "expected": "z"},
    {"input": ("ababcdc",), "expected": "a"},
    {"input": ("x",), "expected": "x"},
    {"input": ("aabbbcccc",), "expected": "c"},
]