## **Most Frequent Character**

### **Problem Statement**
Given a lowercase alphabetic string `s`, return the **character that appears most frequently**.

If there are multiple characters with the same highest frequency, return the one that appears **first** in the string.

---

### **Example 1**
```python
Input: "apple"
Output: "p"
Explanation: 'p' appears twice, which is more than any other character.
```

### **Example 2**
```python
Input: "banana"
Output: "a"
Explanation: Both 'a' and 'n' appear 2 times, but 'a' comes first.
```

### **Example 3**
```python
Input: "abcde"
Output: "a"
Explanation: All characters appear once, so return the first one.
```

---

### **Constraints**
- `1 <= len(s) <= 10^5`
- `s` contains only lowercase English letters.

---

### **Follow-up Questions**
1. How would you solve this without using any library like `collections.Counter`?
2. Can this be solved in a single pass with some extra tracking?
3. How would you adapt this to return **all** max-frequency characters?

---

### **Additional Edge Cases**
1. **All characters the same**  
   ```python
   Input: "zzzzz"
   Output: "z"
   Explanation: All characters are the same, clearly most frequent.
   ```

2. **Multiple top-frequency characters**  
   ```python
   Input: "ababcdc"
   Output: "a"
   Explanation: 'a', 'b', and 'c' all appear twice, but 'a' is first.
   ```

3. **Only one character**  
   ```python
   Input: "x"
   Output: "x"
   Explanation: Only one possible result.
   ```
