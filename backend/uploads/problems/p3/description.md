## **Merge Sorted Arrays**

You are given two sorted integer arrays `nums1` and `nums2`, and two integers `m` and `n` representing the number of elements in `nums1` and `nums2` respectively.

You must **merge `nums2` into `nums1` as one sorted array**, returning the final merged array.

`nums1` has a length of `m + n`, where the first `m` elements denote the elements that should be merged, and the last `n` elements are set to `0` and should be ignored.

---

### **Example 1:**
```python
Input: nums1 = [1,2,3,0,0,0], m = 3
       nums2 = [2,5,6], n = 3
Output: [1,2,2,3,5,6]
```

### **Example 2:**
```python
Input: nums1 = [1], m = 1
       nums2 = [], n = 0
Output: [1]
Explanation: Since nums2 is empty, nums1 remains unchanged.
```

### **Example 3:**
```python
Input: nums1 = [0], m = 0
       nums2 = [1], n = 1
Output: [1]
Explanation: Since nums1 is empty (m=0), nums2 is simply copied to nums1.
```

---

### **Constraints:**
- `0 <= m, n <= 10^5`
- `-10^9 <= nums1[i], nums2[i] <= 10^9`
- `nums1.length == m + n`
- `nums2.length == n`
- `nums1` has enough space (`m + n` elements) to accommodate all elements from `nums2`.

---

### **Follow-up Questions:**
1. Can you implement an **O(m + n) time complexity** solution?
2. Can you solve this **without using extra space**?
3. How would you handle merging two linked lists instead of arrays?

---

### **Additional Edge Cases to Consider:**
1. **Already sorted case**
   ```python
   Input: nums1 = [1,2,3,4,5,6], m = 6
   nums2 = [], n = 0
   Output: [1,2,3,4,5,6]
   ```
2. **All elements in nums2 are smaller than nums1**
   ```python
   Input: nums1 = [4,5,6,0,0,0], m = 3
   nums2 = [1,2,3], n = 3
   Output: [1,2,3,4,5,6]
   ```
3. **All elements in nums2 are larger than nums1**
   ```python
   Input: nums1 = [1,2,3,0,0,0], m = 3
   nums2 = [7,8,9], n = 3
   Output: [1,2,3,7,8,9]
   ```
