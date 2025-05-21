## **Fibonacci Number**

The Fibonacci sequence is defined as follows:
- `F(0) = 0`
- `F(1) = 1`
- `F(n) = F(n - 1) + F(n - 2)` for `n >= 2`

Given an integer `n`, return `F(n)`.

---

### **Example 1:**
```python
Input: n = 5
Output: 5
Explanation: The Fibonacci sequence up to `F(5)` is: [0, 1, 1, 2, 3, 5].
```

### **Example 2:**
```python
Input: n = 10
Output: 55
Explanation: The Fibonacci sequence up to `F(10)` is: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55].
```

### **Example 3:**
```python
Input: n = 0
Output: 0
Explanation: By definition, `F(0) = 0`.
```

---

### **Constraints:**
- `0 <= n <= 30`
- The result is guaranteed to fit within a **32-bit signed integer**.

---

### **Follow-up Questions:**
1. Can you solve this problem **iteratively** instead of recursively?
2. What is the **time complexity** of the recursive approach? Can you optimize it?
3. Can you solve this in **O(1) space**?
4. How would you compute `F(n)` for **large values** of `n`, such as `n = 10^5`?

---

### **Additional Edge Cases to Consider:**
1. **Base cases**
   ```python
   Input: n = 1
   Output: 1
   ```
2. **Smallest non-trivial case**
   ```python
   Input: n = 2
   Output: 1
   ```
3. **Larger `n` values**
   ```python
   Input: n = 20
   Output: 6765
   ```
4. **Efficiency Check**
   - Recursive approach may cause stack overflow for large `n`.
   - Iterative or memoized solutions are preferred for larger inputs.
