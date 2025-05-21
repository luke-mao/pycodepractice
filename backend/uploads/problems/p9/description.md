## **Merge Two Sorted Lists**

You are given the heads of **two sorted linked lists** `l1` and `l2`. 

Merge the two lists into **one sorted linked list** and return its head.

---

### **Example 1:**
```python
Input: l1 = [1,2,4], l2 = [1,3,4]
Output: [1,1,2,3,4,4]
Explanation: Both linked lists are sorted. The merged list maintains the sorted order.
```

### **Example 2:**
```python
Input: l1 = [], l2 = []
Output: []
Explanation: Both lists are empty, so the result is also an empty list.
```

### **Example 3:**
```python
Input: l1 = [], l2 = [0]
Output: [0]
Explanation: Since `l1` is empty, the merged list is just `l2`.
```

---

### **Constraints:**
- The number of nodes in both lists is in the range `[0, 50]`.
- `-100 <= Node.val <= 100`
- Both `l1` and `l2` are **sorted** in non-decreasing order.

---

### **Follow-up Questions:**
1. Can you solve this problem using **recursion**?
2. How would you implement this **iteratively**?
3. What if the linked lists were **not sorted**? How would you modify your approach?
4. How would this problem change if it were **doubly linked lists** instead of singly linked lists?

---

### **Additional Edge Cases to Consider:**
1. **One list is empty**
   ```python
   Input: l1 = [1,2,3], l2 = []
   Output: [1,2,3]
   ```
2. **All elements are the same**
   ```python
   Input: l1 = [2,2,2], l2 = [2,2,2]
   Output: [2,2,2,2,2,2]
   ```
3. **Lists of different lengths**
   ```python
   Input: l1 = [1,3,5,7], l2 = [2,4]
   Output: [1,2,3,4,5,7]
   ```
4. **Lists with negative numbers**
   ```python
   Input: l1 = [-3,-1,4], l2 = [-2,2,5]
   Output: [-3,-2,-1,2,4,5]
   ```
