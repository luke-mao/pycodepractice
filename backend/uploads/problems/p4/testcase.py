# Import the user-defined function from submission.py
from submission import maxDepth as user_submission

from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def build_tree(values):
    """Build binary tree from level-order list with None as missing nodes."""
    if not values:
        return None

    root = TreeNode(values[0])
    queue = deque([root])
    index = 1

    while queue and index < len(values):
        node = queue.popleft()

        # Left child
        if index < len(values) and values[index] is not None:
            node.left = TreeNode(values[index])
            queue.append(node.left)
        index += 1

        # Right child
        if index < len(values) and values[index] is not None:
            node.right = TreeNode(values[index])
            queue.append(node.right)
        index += 1

    return root


# Define the test cases as a list of dictionaries
test_cases = [
    {"input": (build_tree([3, 9, 20, None, None, 15, 7]),), "expected": 3},
    {"input": (build_tree([1, None, 2]),), "expected": 2},
    {"input": (build_tree([]),), "expected": 0},
    {"input": (build_tree([1]),), "expected": 1},
    {"input": (build_tree([1, 2, None, 3, None, 4, None]),), "expected": 4},
    {"input": (build_tree([1, None, 2, None, 3, None, 4]),), "expected": 4},
    {"input": (build_tree([10, 5, 15, 2, 7, 12, 20]),), "expected": 3},
    {"input": (build_tree([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),), "expected": 4},
    {"input": (build_tree([3, 9, 20, None, None, 15, 7, 1, 2]),), "expected": 4},
    {"input": (build_tree([1, 2, 3, 4, 5, None, None, None, None, 6]),), "expected": 4},
]
