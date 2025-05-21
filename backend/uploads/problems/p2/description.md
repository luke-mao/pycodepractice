## **Palindrome Number**

Given an integer `x`, return `true` if `x` is a **palindrome integer**.

An integer is a **palindrome** when it **reads the same forward and backward**.

For example, `121` is a palindrome while `123` is not.

---

### **Example 1:**
```python
Input: x = 121
Output: True
Explanation: 121 reads the same forward and backward.
```

### **Example 2:**
```python
Input: x = -121
Output: False
Explanation: -121 reads as 121- from right to left. Hence, it's not a palindrome.
```

### **Example 3:**
```python
Input: x = 10
Output: False
Explanation: 10 reads as 01 from right to left.
```

---

### **Constraints:**
- `-2^31 <= x <= 2^31 - 1`
- The input number `x` is an integer.

---

### **Follow-up Questions:**
1. Can you solve this problem **without converting the integer to a string**?
2. How would you optimize for **time complexity O(log x)**?

---

### **Additional Edge Cases to Consider:**
1. **Single-digit numbers are always palindromes**
   - `x = 5` → `Output: True`
2. **Large palindromes**
   - `x = 12344321` → `Output: True`
3. **Trailing zeroes are not palindromes unless `x == 0`**
   - `x = 100` → `Output: False`
   - `x = 0` → `Output: True`
4. **Negative numbers are never palindromes**
   - `x = -1` → `Output: False`
