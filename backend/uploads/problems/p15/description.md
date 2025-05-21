## **Integer to Roman**

Given an integer `num`, convert it to a **Roman numeral**.

The Roman numeral system uses the following symbols:

| Symbol | Value |
|--------|-------|
| I      | 1     |
| V      | 5     |
| X      | 10    |
| L      | 50    |
| C      | 100   |
| D      | 500   |
| M      | 1000  |

Roman numerals follow these rules:
- The symbols are placed from largest to smallest.
- Some numbers require **subtractive notation**, such as:
  - `4` → `"IV"` (instead of `"IIII"`)
  - `9` → `"IX"`
  - `40` → `"XL"`
  - `90` → `"XC"`
  - `400` → `"CD"`
  - `900` → `"CM"`

Return the Roman numeral representation of `num`.

---

### **Example 1**
```python
Input: num = 3
Output: "III"
```

### **Example 2**
```python
Input: num = 58
Output: "LVIII"
Explanation: L = 50, V = 5, III = 3.
```

### **Example 3**
```python
Input: num = 1994
Output: "MCMXCIV"
Explanation: M = 1000, CM = 900, XC = 90, IV = 4.
```

---

### **Constraints**
- `1 <= num <= 3999`

---

### **Follow-up Questions**
1. Can you solve this in **O(1) time complexity**?
2. How would you modify this to **convert from Roman numeral to integer**?
3. How would you handle numbers **greater than 3999**, which are represented using overlines?

---

### **Additional Edge Cases**
1. **Smallest input**
   ```python
   Input: num = 1
   Output: "I"
   ```
2. **Largest input**
   ```python
   Input: num = 3999
   Output: "MMMCMXCIX"
   ```
3. **Numbers requiring subtractive notation**
   ```python
   Input: num = 944
   Output: "CMXLIV"
   ```
