def maxArea(height):
    """
    Optimized O(n) solution using two-pointer approach.
    """
    left, right = 0, len(height) - 1
    max_water = 0

    while left < right:
        max_water = max(max_water, (right - left) * min(height[left], height[right]))
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1

    return max_water
