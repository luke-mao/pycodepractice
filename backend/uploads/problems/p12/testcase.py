# Import the user-defined function from submission.py
from submission import longestPalindrome as user_submission

# Define the test cases as a list of dictionaries
test_cases = [
    {"input": ("babad",), "expected": "bab"},  # "aba" is also a valid answer
    {"input": ("cbbd",), "expected": "bb"},
    {"input": ("a",), "expected": "a"},
    {"input": ("ac",), "expected": "a"},  # or "c"
    {"input": ("racecar",), "expected": "racecar"},
    {"input": ("abcdef",), "expected": "a"},  # or any single character
    {"input": ("abcddcba",), "expected": "abcddcba"},
    {"input": ("aaaaaa",), "expected": "aaaaaa"},
    {"input": ("bananas",), "expected": "anana"},
    {"input": ("abb",), "expected": "bb"},
]
