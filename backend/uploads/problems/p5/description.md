## **Valid Parentheses**

Given a string containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['`, and `']'`, determine if the input string is **valid**.

A string is **valid** if:
1. **Each open bracket** has a corresponding **matching close bracket** of the same type.
2. **Open brackets must be closed in the correct order** (i.e., a closing bracket should close the most recently opened bracket of the same type).
3. **A closing bracket cannot appear without a preceding corresponding open bracket**.

---

### **Example 1:**
```python
Input: "()[]{}"
Output: True
Explanation: Each open bracket has a corresponding closing bracket in the correct order.
```

### **Example 2:**
```python
Input: "(]"
Output: False
Explanation: `(` is not closed by `)`, but instead `]`, making it invalid.
```

### **Example 3:**
```python
Input: "([{}])"
Output: True
Explanation: The brackets are nested correctly.
```

### **Example 4:**
```python
Input: "({[)]}"
Output: False
Explanation: The correct order is violated.
```

### **Example 5:**
```python
Input: "{[]}"
Output: True
Explanation: The brackets are properly nested.
```

---

### **Constraints:**
- `1 <= s.length <= 10^4`
- `s` consists only of `'('`, `')'`, `'{'`, `'}'`, `'['`, and `']'`.

---

### **Follow-up Questions:**
1. Can you solve this using **O(n) time complexity**?
2. Can you solve this problem **without using extra space**, or is a **stack-based** approach necessary?
3. What if you had additional bracket types, such as `< >`?

---

### **Additional Edge Cases to Consider:**
1. **Empty input string**
   ```python
   Input: ""
   Output: True
   Explanation: An empty string is trivially valid.
   ```
2. **Single bracket**
   ```python
   Input: "("
   Output: False
   ```
3. **Unbalanced brackets**
   ```python
   Input: "((((("
   Output: False
   ```
4. **Extra closing brackets**
   ```python
   Input: "())"
   Output: False
   ```
