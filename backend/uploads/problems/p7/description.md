## **Climbing Stairs**

You are climbing a staircase. It takes **`n`** steps to reach the top. Each time you can either **climb 1 or 2 steps**.

Return the number of **distinct ways** you can reach the top.

---

### **Example 1:**
```python
Input: n = 2
Output: 2
Explanation:
1. Step 1 → Step 2
2. Step 1 → Step 3
```

### **Example 2:**
```python
Input: n = 3
Output: 3
Explanation:
1. Step 1 → Step 2 → Step 3
2. Step 1 → Step 3
3. Step 2 → Step 3
```

### **Example 3:**
```python
Input: n = 5
Output: 8
Explanation:
The possible ways to climb the staircase are:
1. 1 → 1 → 1 → 1 → 1
2. 1 → 1 → 1 → 2
3. 1 → 1 → 2 → 1
4. 1 → 2 → 1 → 1
5. 2 → 1 → 1 → 1
6. 1 → 2 → 2
7. 2 → 1 → 2
8. 2 → 2 → 1
```

---

### **Constraints:**
- `1 <= n <= 45`
- The answer is guaranteed to fit in a **32-bit signed integer**.

---

### **Follow-up Questions:**
1. Can you solve this problem **in O(n) time complexity**?
2. Can you solve this problem **using O(1) space**?
3. How would this change if you were allowed to climb **1, 2, or 3 steps at a time**?

---

### **Additional Edge Cases to Consider:**
1. **Smallest input value**
   ```python
   Input: n = 1
   Output: 1
   ```
2. **Larger staircases**
   ```python
   Input: n = 10
   Output: 89
   ```
3. **Comparing against Fibonacci Sequence**
   - `ways(n) = ways(n-1) + ways(n-2)`, which follows the Fibonacci sequence.
