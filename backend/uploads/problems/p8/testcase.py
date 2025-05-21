# Import the user-defined function from solution.py
from submission import removeDuplicates as user_submission

# Define the test cases as a list of dictionaries
test_cases = [
    {"input": ([1, 1, 2],), "expected": 2},
    {"input": ([0, 0, 1, 1, 1, 2, 2, 3, 3, 4],), "expected": 5},
    {"input": ([5, 5, 5, 5, 5],), "expected": 1},
    {"input": ([1, 2, 3, 4, 5],), "expected": 5},
    {"input": ([1],), "expected": 1},
    {"input": ([1, 1, 1, 2, 2, 3],), "expected": 3},
    {"input": ([1, 1, 2, 3, 3, 3, 4, 5, 5],), "expected": 5},
    {"input": ([-3, -3, -2, -1, -1, 0, 0, 1],), "expected": 5},
    {"input": ([2] * 15000 + [3] * 15000,), "expected": 2},
    {"input": ([-(10**4), -(10**4), 0, 0, 10**4, 10**4],), "expected": 3},
]
