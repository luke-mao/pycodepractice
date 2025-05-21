def mergeSortedArrays(nums1, m, nums2, n):
    """
    Optimized O(m + n) solution that returns the merged array.
    """
    p1, p2 = 0, 0
    merged = []

    while p1 < m and p2 < n:
        if nums1[p1] < nums2[p2]:
            merged.append(nums1[p1])
            p1 += 1
        else:
            merged.append(nums2[p2])
            p2 += 1

    # Add remaining elements
    while p1 < m:
        merged.append(nums1[p1])
        p1 += 1
    while p2 < n:
        merged.append(nums2[p2])
        p2 += 1

    return merged
