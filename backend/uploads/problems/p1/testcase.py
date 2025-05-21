# Import the user-defined function from submission.py
from submission import findTwoSum as user_submission

# Define the test cases as a list of dictionaries
test_cases = [
    {"input": ([2, 7, 11, 15], 9), "expected": [0, 1]},
    {"input": ([3, 2, 4], 6), "expected": [1, 2]},
    {"input": ([3, 3], 6), "expected": [0, 1]},
    {"input": ([1, 2, 3, 4, 5], 3), "expected": [0, 1]},
    {"input": ([-3, 4, 3, 90], 0), "expected": [0, 2]},
    {"input": ([1, 1, 1, 1, 1, 1], 2), "expected": [0, 1]},
    {"input": ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1000], 1009), "expected": [8, 10]},
    {"input": ([5, 25, 75], 100), "expected": [1, 2]},
    {"input": ([0, 4, 3, 0], 0), "expected": [0, 3]},
    {"input": ([1, 2, 5, 8, 12], 9), "expected": [0, 3]},
]
