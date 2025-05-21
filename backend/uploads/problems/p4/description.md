## **Maximum Depth of Binary Tree**

Given the `root` of a **binary tree**, return its **maximum depth**.

The **maximum depth** of a binary tree is the number of nodes along the longest path from the root node down to the farthest leaf node.

---

### **Example 1:**
```python
Input: root = [3,9,20,null,null,15,7]
Output: 3
Explanation:
    3
   / \
  9  20
    /  \
   15   7
The longest path is from `3 → 20 → 15` or `3 → 20 → 7`, with a depth of `3`.
```

### **Example 2:**
```python
Input: root = [1, null, 2]
Output: 2
Explanation:
    1
     \
      2
The longest path is `1 → 2`, with a depth of `2`.
```

---

### **Constraints:**
- The number of nodes in the tree is in the range **`[0, 10^4]`**.
- `-100 <= Node.val <= 100`
- A **null node** represents an empty child.

---

### **Follow-up Questions:**
1. Can you solve this problem using **both recursion and iteration** (DFS and BFS)?
2. How would you solve this problem **without recursion**?
3. Can you extend this problem to a **balanced binary tree check**?

---

### **Additional Edge Cases to Consider:**
1. **Empty Tree**
   ```python
   Input: root = []
   Output: 0
   Explanation: An empty tree has a depth of `0`.
   ```
2. **Single Node**
   ```python
   Input: root = [1]
   Output: 1
   Explanation: The tree consists of only the root node.
   ```
3. **Left-Skewed Tree**
   ```python
   Input: root = [1,2,null,3,null,4,null]
   Output: 4
   Explanation:
         1
        /
       2
      /
     3
    /
   4

4. **Right-Skewed Tree**
   ```python
   Input: root = [1,null,2,null,3,null,4]
   Output: 4
   Explanation:
   1
    \
     2
      \
       3
        \
         4
   ```
5. **Balanced Tree with More Levels**
   ```python
   Input: root = [10,5,15,2,7,12,20]
   Output: 3
   Explanation
        10
       /  \
      5    15
     / \   / \
    2   7 12  20
   ```
