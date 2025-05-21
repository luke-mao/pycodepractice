def longestPalindrome(s):
    """
    Optimized O(n²) solution using the expand-around-center approach.
    """
    if not s or len(s) == 1:
        return s

    def expand_around_center(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return s[left + 1 : right]

    longest = ""
    for i in range(len(s)):
        # Odd-length palindromes
        odd_palindrome = expand_around_center(i, i)
        # Even-length palindromes
        even_palindrome = expand_around_center(i, i + 1)

        if len(odd_palindrome) > len(longest):
            longest = odd_palindrome
        if len(even_palindrome) > len(longest):
            longest = even_palindrome

    return longest
