# Import the user-defined function from submission.py
from submission import maxProfit as user_submission

# Define the test cases as a list of dictionaries
test_cases = [
    {"input": ([7, 1, 5, 3, 6, 4],), "expected": 5},
    {"input": ([7, 6, 4, 3, 1],), "expected": 0},
    {"input": ([2, 4, 1],), "expected": 2},
    {"input": ([3, 2, 6, 5, 0, 3],), "expected": 4},
    {"input": ([5, 5, 5, 5, 5],), "expected": 0},  # No profit scenario
    {"input": ([1, 2, 3, 4, 5],), "expected": 4},  # Increasing prices
    {"input": ([9, 7, 4, 3, 1, 2, 5, 10],), "expected": 9},
    {"input": ([1, 3, 7, 2, 8, 4, 9],), "expected": 8},  # Buy at 1, sell at 9
    {"input": ([10, 1, 2, 3, 4, 5, 6, 7, 8, 9],), "expected": 8},  # Buy at 1, sell at 9
    {"input": ([1],), "expected": 0},  # Only one price, no transaction possible
]
