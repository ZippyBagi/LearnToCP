>In this lesson we will cover some basic math knowledge that will help us optimize our solutions

### Sum of elements from 1 to n:

lets say we have an array of elements:

`1, 2, 3, ..., n-2 n-1, n`

And we want to find their sum.

The intuitive approach is to just go over each one and add it to the sum, so essentially:

`1 + 2 + 3 + ... + n-2 + n-1 + n`

But this is rather slow, it takes us **n** operations to do it this way, so **O(n)**

We can do better, lets look at numbers 1-100
	![[Sum of elements.jpg]]
Notice how all of them form pairs that sum to 101

In other words, there are `50` pairs of `101`, so our sum is: 

 `(100/2) * 101 = 5050`

If we apply this to all numbers we get the formula: 

**1 + 2 + 3 + ... + n-2 + n-1 + n =** `(n + 1) * n/2`

Since this is a single operation, the time complexity is **O(1)**