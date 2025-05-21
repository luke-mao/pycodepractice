## **Longest Substring Without Repeating Characters**

Given a string `s`, find the length of the **longest substring** without repeating characters.

---

### **Example 1**
```python
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with a length of 3.
```

### **Example 2**
```python
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with a length of 1.
```

### **Example 3**
```python
Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with a length of 3.
```

---

### **Constraints**
- `0 <= len(s) <= 10^5`
- `s` consists of English letters, digits, symbols, and spaces.

---

### **Follow-up Questions**
1. Can you solve this in **O(n) time complexity**?
2. How would your solution change if only lowercase letters were allowed?
3. How would you modify the solution if spaces were considered as duplicate characters?

---

### **Additional Edge Cases**
1. **Empty string**
   ```python
   Input: s = ""
   Output: 0
   ```
2. **Single character**
   ```python
   Input: s = "a"
   Output: 1
   ```
3. **All unique characters**
   ```python
   Input: s = "abcdef"
   Output: 6
   ```
4. **All characters repeating**
   ```python
   Input: s = "aaaaa"
   Output: 1
   ```

