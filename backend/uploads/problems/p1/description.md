## **Two Sum**

Given an array of integers `nums` and an integer `target`, return **indices** of the two numbers such that they add up to `target`.

You **may assume** that each input would have **exactly one solution**, and **you may not use the same element twice**.

You can return the answer in **any order**.

---

### **Example 1:**
```python
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9
```

### **Example 2:**
```python
Input: nums = [3, 2, 4], target = 6
Output: [1, 2]
Explanation: nums[1] + nums[2] = 2 + 4 = 6
```

### **Example 3:**
```python
Input: nums = [3, 3], target = 6
Output: [0, 1]
Explanation: nums[0] + nums[1] = 3 + 3 = 6
```

---

### **Constraints:**
- `2 <= nums.length <= 10^4`
- `-10^9 <= nums[i] <= 10^9`
- `-10^9 <= target <= 10^9`
- **Exactly one** valid answer exists.

---

### **Follow-up:**
- Can you come up with an **O(n)** time complexity solution?

---

### **Edge Cases to Consider:**
1. **Negative numbers**
   - `nums = [-3, 4, 3, 90]`, `target = 0` → `Output: [0, 2]`
2. **All elements are the same**
   - `nums = [1, 1, 1, 1, 1, 1]`, `target = 2` → `Output: [0, 1]`
3. **Numbers appearing at the end**
   - `nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1000]`, `target = 1009` → `Output: [9, 10]`
