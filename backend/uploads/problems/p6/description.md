## **Best Time to Buy and Sell Stock**

You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day.

You want to maximize your profit by choosing a **single day to buy one stock** and choosing a **different day in the future to sell** that stock.

Return the **maximum profit** you can achieve from this transaction. If **no profit can be achieved**, return `0`.

---

### **Example 1:**
```python
Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation:
Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.
Note that buying on day 1 and selling on day 6 produces a lower profit (4).
```

### **Example 2:**
```python
Input: prices = [7,6,4,3,1]
Output: 0
Explanation:
In this case, no transaction is done since the price only decreases.
```

### **Example 3:**
```python
Input: prices = [2,4,1]
Output: 2
Explanation:
Buy on day 1 (price = 2) and sell on day 2 (price = 4), profit = 4 - 2 = 2.
```

---

### **Constraints:**
- `1 <= prices.length <= 10^5`
- `0 <= prices[i] <= 10^4`

---

### **Follow-up Questions:**
1. Can you solve this problem in **O(n) time complexity**?
2. Can you solve this problem **with constant space O(1)**?
3. What if you are allowed to make **multiple transactions** instead of just one?
4. How would you modify the solution to include a **cooldown period** (i.e., you cannot sell immediately after buying)?

---

### **Additional Edge Cases to Consider:**
1. **Single-day stock market**
   ```python
   Input: prices = [5]
   Output: 0
   Explanation: No transaction can be made.
   ```
2. **Multiple lowest points but only one best sell**
   ```python
   Input: prices = [3,2,6,5,0,3]
   Output: 4
   Explanation: Buy on day 2 (price = 2), sell on day 3 (price = 6).
   ```
3. **Fluctuating prices but no clear profit**
   ```python
   Input: prices = [5,5,5,5,5]
   Output: 0
   ```
