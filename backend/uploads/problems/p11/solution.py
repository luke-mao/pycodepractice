def lengthOfLongestSubstring(s):
    """
    Optimized O(n) solution using a sliding window approach.
    """
    char_set = set()
    left = max_length = 0

    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_length = max(max_length, right - left + 1)

    return max_length
