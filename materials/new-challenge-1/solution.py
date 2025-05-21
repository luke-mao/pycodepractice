def first_uniq_char(s: str) -> int:
    """
    Finds the index of the first non-repeating character in a string.

    Args:
        s (str): The input string.

    Returns:
        int: Index of the first unique character or -1 if none exist.
    """
    from collections import Counter

    freq = Counter(s)

    for idx, char in enumerate(s):
        if freq[char] == 1:
            return idx

    return -1