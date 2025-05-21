# Import the user-defined function from submission.py
from submission import mergeSortedArrays as user_submission

# Define the test cases as a list of dictionaries
test_cases = [
    {"input": ([1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3), "expected": [1, 2, 2, 3, 5, 6]},
    {"input": ([1], 1, [], 0), "expected": [1]},
    {"input": ([0], 0, [1], 1), "expected": [1]},
    {"input": ([4, 5, 6, 0, 0, 0], 3, [1, 2, 3], 3), "expected": [1, 2, 3, 4, 5, 6]},
    {"input": ([1, 2, 3, 0, 0, 0], 3, [7, 8, 9], 3), "expected": [1, 2, 3, 7, 8, 9]},
    {"input": ([2, 2, 2, 0, 0, 0], 3, [2, 2, 2], 3), "expected": [2, 2, 2, 2, 2, 2]},
    {
        "input": ([1, 3, 5, 7, 0, 0, 0, 0], 4, [2, 4, 6, 8], 4),
        "expected": [1, 2, 3, 4, 5, 6, 7, 8],
    },
    {"input": ([1, 1, 1, 0, 0, 0], 3, [1, 1, 1], 3), "expected": [1, 1, 1, 1, 1, 1]},
    {
        "input": ([0, 0, 0, 0, 0, 0], 0, [1, 2, 3, 4, 5, 6], 6),
        "expected": [1, 2, 3, 4, 5, 6],
    },
    {"input": ([1, 2, 3, 4, 5, 6], 6, [], 0), "expected": [1, 2, 3, 4, 5, 6]},
]
