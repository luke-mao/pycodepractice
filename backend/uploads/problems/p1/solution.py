def findTwoSum(nums, target):
    """
    Optimized O(n) solution using a hash map.
    """
    num_map = {}  # Dictionary to store {num: index}

    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i

    return None  # Should never reach here, given problem constraints
