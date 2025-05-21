def isValid(s):
    """
    Optimized O(n) solution using a stack.
    """
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}

    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else "#"
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)

    return not stack  # The stack must be empty for a valid sequence
