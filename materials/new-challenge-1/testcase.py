# Import the user-defined function from submission.py
# keep the line 3 as it is
from submission import first_uniq_char as user_submission

# Define the test cases as a list of dictionaries
test_cases = [
    {"input": ("leetcode",), "expected": 0},
    {"input": ("loveleetcode",), "expected": 2},
    {"input": ("aabb",), "expected": -1},
    {"input": ("z",), "expected": 0},
    {"input": ("aabbccd",), "expected": 6},
    {"input": ("abcdabcd",), "expected": -1},
    {"input": ("aabc",), "expected": 2},
]