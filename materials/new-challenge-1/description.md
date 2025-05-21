## **First Unique Character in a String**

### **Problem Statement**
Given a string `s`, find the first non-repeating character in it and return its index. If it does not exist, return `-1`.

You need to identify the first character that appears only once in the entire string and return its index (0-based).

---

### **Example 1**
```python
Input: "leetcode"
Output: 0
Explanation: The character 'l' is the first non-repeating character and appears at index 0.
```

### **Example 2**
```python
Input: "loveleetcode"
Output: 2
Explanation: The character 'v' is the first non-repeating character and appears at index 2.
```

### **Example 3**
```python
Input: "aabb"
Output: -1
Explanation: No character appears exactly once.
```

---

### **Constraints**
- `1 <= len(s) <= 10^5`
- `s` consists of lowercase English letters only.

---

### **Follow-up Questions**
1. Can you do it in one pass through the string?
2. What data structure helps the most here and why?
3. How would your solution scale with very large input?

---

### **Additional Edge Cases**
1. **Single character string**  
   ```python
   Input: "z"
   Output: 0
   Explanation: The only character is unique.
   ```
2. **All characters repeating**  
   ```python
   Input: "aabbcc"
   Output: -1
   Explanation: All characters repeat at least once.
   ```
3. **Unique character at the end**  
   ```python
   Input: "aabbccd"
   Output: 6
   Explanation: 'd' is the first unique character and is at the end.
   ```

---

### **Why This is Important**
- Tests knowledge of frequency counting using hash maps.
- A common question in interviews to check if you can optimize for time complexity.
