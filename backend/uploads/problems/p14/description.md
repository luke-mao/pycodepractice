## **Container With Most Water**

You are given an integer array `height` where `height[i]` represents the height of a vertical line at index `i`. 

Find two lines that together with the x-axis form a container, such that the container **holds the most water**.

Return the **maximum amount of water** a container can store.

---

### **Example 1**
```python
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
Explanation: The two vertical lines at index 1 (height 8) and index 8 (height 7) form the maximum container, holding 49 units of water.
```

### **Example 2**
```python
Input: height = [1,1]
Output: 1
```

---

### **Constraints**
- `2 <= len(height) <= 10^5`
- `0 <= height[i] <= 10^4`

---

### **Follow-up Questions**
1. Can you solve this in **O(n²) brute-force**?
2. Can you optimize it to run in **O(n) time complexity**?
3. How would this change if we needed to return the **indices of the two lines** instead of the max water?

---

### **Additional Edge Cases**
1. **All elements are the same height**
   ```python
   Input: height = [5,5,5,5,5]
   Output: 20  # Maximum area with first and last index
   ```
2. **Decreasing heights**
   ```python
   Input: height = [10,9,8,7,6,5,4,3,2,1]
   Output: 25
   ```
3. **Minimum input case**
   ```python
   Input: height = [2,3]
   Output: 2
   ```
