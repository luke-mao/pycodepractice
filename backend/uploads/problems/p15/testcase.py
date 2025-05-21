# Import the user-defined function from submission.py
from submission import intToRoman as user_submission

# Define the test cases as a list of dictionaries
test_cases = [
    {"input": (3,), "expected": "III"},
    {"input": (4,), "expected": "IV"},
    {"input": (9,), "expected": "IX"},
    {"input": (58,), "expected": "LVIII"},
    {"input": (1994,), "expected": "MCMXCIV"},
    {"input": (3999,), "expected": "MMMCMXCIX"},
    {"input": (1,), "expected": "I"},
    {"input": (10,), "expected": "X"},
    {"input": (944,), "expected": "CMXLIV"},
    {"input": (2768,), "expected": "MMDCCLXVIII"},
]
