# Import the user-defined function from submission.py
from submission import lengthOfLongestSubstring as user_submission

# Define the test cases as a list of dictionaries
test_cases = [
    {"input": ("abcabcbb",), "expected": 3},
    {"input": ("bbbbb",), "expected": 1},
    {"input": ("pwwkew",), "expected": 3},
    {"input": ("",), "expected": 0},
    {"input": ("abcdef",), "expected": 6},
    {"input": ("aaaaa",), "expected": 1},
    {"input": ("abba",), "expected": 2},
    {"input": ("dvdf",), "expected": 3},
    {"input": ("tmmzuxt",), "expected": 5},
    {"input": ("abcdefgabcdefgh",), "expected": 8},  # abcdefgh
]
