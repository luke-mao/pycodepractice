def most_frequent_char(s: str) -> str:
    """
    Returns the most frequent character in the string.
    If tie, returns the one that appears first in the string.

    Args:
        s (str): Input string of lowercase letters.

    Returns:
        str: The most frequent character.
    """
    from collections import Counter

    freq = Counter(s)
    max_count = max(freq.values())

    for char in s:
        if freq[char] == max_count:
            return char