class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def maxDepth(root):
    """
    Optimized recursive solution using DFS (O(n) time complexity).
    """
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))
