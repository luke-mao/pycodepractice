def threeSum(nums):
    """
    Optimized O(n²) solution using sorting and two-pointer approach.
    """
    nums.sort()
    result = []

    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:  # Skip duplicate values
            continue

        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                result.append([nums[i], nums[left], nums[right]])
                left += 1
                right -= 1
                while left < right and nums[left] == nums[left - 1]:  # Skip duplicates
                    left += 1
                while (
                    left < right and nums[right] == nums[right + 1]
                ):  # Skip duplicates
                    right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1

    return result
