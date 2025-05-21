# Import the user-defined function from submission.py
from submission import maxArea as user_submission

# Define the test cases as a list of dictionaries
test_cases = [
    {"input": ([1, 8, 6, 2, 5, 4, 8, 3, 7],), "expected": 49},
    {"input": ([1, 1],), "expected": 1},
    {"input": ([4, 3, 2, 1, 4],), "expected": 16},
    {"input": ([1, 2, 1],), "expected": 2},
    {"input": ([10, 9, 8, 7, 6, 5, 4, 3, 2, 1],), "expected": 25},
    {"input": ([2, 3],), "expected": 2},
    {"input": ([5, 5, 5, 5, 5],), "expected": 20},
    {"input": ([6, 9, 3, 4, 5, 8],), "expected": 32},
    {"input": ([3, 1, 2, 4, 5, 7, 8, 3, 5, 6, 9],), "expected": 35},
    {"input": ([100, 1, 100, 1, 100, 1, 100, 1, 100],), "expected": 800},
]
