# always import the function and rename to user_submission
from submission import findTwoSum as user_submission

# always define the test cases in the variable of "test_cases".
# and the "input" and "expected" keys are required.
test_cases = [
    {"input": ([1, 2, 3, 4, 5], 3), "expected": [0, 1]},
    {"input": ([1, 2, 3, 4, 5], 9), "expected": [3, 4]},
    {"input": ([1, 2, 3, 4, 5], 4), "expected": [0, 2]},
]
