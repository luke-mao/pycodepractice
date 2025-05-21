## **3Sum**

Given an integer array `nums`, return all the **unique triplets** `[nums[i], nums[j], nums[k]]` such that:

- `i != j != k`
- `nums[i] + nums[j] + nums[k] == 0`

The solution set **must not contain duplicate triplets**.

---

### **Example 1**
```python
Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2], [-1,0,1]]
```

### **Example 2**
```python
Input: nums = []
Output: []
```

### **Example 3**
```python
Input: nums = [0,0,0]
Output: [[0,0,0]]
```

---

### **Constraints**
- `0 <= len(nums) <= 3000`
- `-10^5 <= nums[i] <= 10^5`

---

### **Follow-up Questions**
1. Can you solve this in **O(n²) time complexity**?
2. How would you modify this to return **only one triplet** if multiple solutions exist?
3. What changes would be required if we wanted **triplets that sum to a target k** instead of 0?

---

### **Additional Edge Cases**
1. **No valid triplets**
   ```python
   Input: nums = [1, 2, 3, 4]
   Output: []
   ```
2. **All zeros**
   ```python
   Input: nums = [0, 0, 0, 0]
   Output: [[0, 0, 0]]
   ```
3. **Large negative and positive values**
   ```python
   Input: nums = [-100000, 50000, 50000]
   Output: [[-100000, 50000, 50000]]
   ```
