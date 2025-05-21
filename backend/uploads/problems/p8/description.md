## **Remove Duplicates from Sorted Array**

### **Problem Statement**

Given an integer array `nums` **sorted in non-decreasing order**, remove the duplicates **in-place** such that each unique element appears **only once**.

Return the **number of unique elements**.

The first `k` elements of `nums` should contain the unique elements in order. The remaining elements beyond `k` can be ignored.

---

### **Function Signature**

```python
def removeDuplicates(nums: List[int]) -> int
```

---

### **Example 1:**
```python
Input: nums = [1, 1, 2]
Output: 2
# nums is modified to [1, 2, _]
```

### **Example 2:**
```python
Input: nums = [0,0,1,1,1,2,2,3,3,4]
Output: 5
# nums is modified to [0, 1, 2, 3, 4, _ , ...]
```

---

### **Constraints**
- `1 <= nums.length <= 3 * 10^4`
- `-10^4 <= nums[i] <= 10^4`
- `nums` is sorted in **non-decreasing order**

---

### **Edge Cases to Consider**
- All elements are the same
- All elements are unique
- Array has only one element
- Very large input with repeated values
