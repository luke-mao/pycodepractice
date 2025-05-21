def isPalindrome(x):
    """
    Optimized O(log x) solution that does not convert the integer to a string.
    """
    if x < 0 or (
        x % 10 == 0 and x != 0
    ):  # Negative numbers and numbers ending in 0 (except 0) cannot be palindromes
        return False

    reversed_half = 0
    original_x = x

    while x > reversed_half:
        reversed_half = reversed_half * 10 + x % 10
        x //= 10

    return (
        x == reversed_half or x == reversed_half // 10
    )  # Handle even and odd digit cases
