# Import the user-defined function from submission.py
from submission import mergeTwoLists as user_submission


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

    # check if two lists are equal
    def __eq__(self, other):
        # check node by node
        while self and other:
            if self.val != other.val:
                return False
            self = self.next
            other = other.next

        # if both lists are empty, they are equal
        if not self and not other:
            return True
        else:
            return False


def list_to_linked_list(lst):
    """Helper function to convert a list into a linked list."""
    if not lst:
        return None
    head = ListNode(lst[0])
    current = head
    for val in lst[1:]:
        current.next = ListNode(val)
        current = current.next
    return head


def linked_list_to_list(node):
    """Helper function to convert a linked list back into a list for easy comparison."""
    result = []
    while node:
        result.append(node.val)
        node = node.next
    return result


# Define the test cases as a list of dictionaries
test_cases = [
    {
        "input": (list_to_linked_list([1, 2, 4]), list_to_linked_list([1, 3, 4])),
        "expected": list_to_linked_list([1, 1, 2, 3, 4, 4]),
    },
    {
        "input": (list_to_linked_list([]), list_to_linked_list([])),
        "expected": list_to_linked_list([]),
    },
    {
        "input": (list_to_linked_list([]), list_to_linked_list([0])),
        "expected": list_to_linked_list([0]),
    },
    {
        "input": (list_to_linked_list([1, 3, 5, 7]), list_to_linked_list([2, 4])),
        "expected": list_to_linked_list([1, 2, 3, 4, 5, 7]),
    },
    {
        "input": (list_to_linked_list([2, 2, 2]), list_to_linked_list([2, 2, 2])),
        "expected": list_to_linked_list([2, 2, 2, 2, 2, 2]),
    },
    {
        "input": (list_to_linked_list([-3, -1, 4]), list_to_linked_list([-2, 2, 5])),
        "expected": list_to_linked_list([-3, -2, -1, 2, 4, 5]),
    },
    {
        "input": (
            list_to_linked_list([5, 10, 15]),
            list_to_linked_list([2, 4, 8, 12, 14]),
        ),
        "expected": list_to_linked_list([2, 4, 5, 8, 10, 12, 14, 15]),
    },
    {
        "input": (list_to_linked_list([1, 1, 1]), list_to_linked_list([1, 1, 1])),
        "expected": list_to_linked_list([1, 1, 1, 1, 1, 1]),
    },
    {
        "input": (
            list_to_linked_list([-10, -5, 0, 5, 10]),
            list_to_linked_list([-8, -6, -3, 1, 7]),
        ),
        "expected": list_to_linked_list([-10, -8, -6, -5, -3, 0, 1, 5, 7, 10]),
    },
    {
        "input": (list_to_linked_list([1, 2, 3]), list_to_linked_list([])),
        "expected": list_to_linked_list([1, 2, 3]),
    },
]
