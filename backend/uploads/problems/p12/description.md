## **Longest Palindromic Substring**

Given a string `s`, return the **longest palindromic substring** in `s`.

A **palindrome** is a string that reads the same forward and backward.

---

### **Example 1**
```python
Input: s = "babad"
Output: "bab"
Explanation: "aba" is also a valid answer.
```

### **Example 2**
```python
Input: s = "cbbd"
Output: "bb"
```

### **Example 3**
```python
Input: s = "a"
Output: "a"
```

### **Example 4**
```python
Input: s = "ac"
Output: "a"
```

---

### **Constraints**
- `1 <= len(s) <= 1000`
- `s` consists only of lowercase English letters.

---

### **Follow-up Questions**
1. Can you solve this using **O(n²) time complexity**?
2. How would you optimize this to run in **O(n) time complexity**?
3. What changes would be required if you were searching for the **longest palindromic subsequence** instead?

---

### **Additional Edge Cases**
1. **String with all identical characters**
   ```python
   Input: s = "aaaaaa"
   Output: "aaaaaa"
   ```
2. **Palindrome at the end of the string**
   ```python
   Input: s = "abcddcba"
   Output: "abcddcba"
   ```
3. **No repeating characters**
   ```python
   Input: s = "abcdefg"
   Output: "a"  # or any single character from the string
   ```
