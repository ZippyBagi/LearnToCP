>This lesson will focus on learning what time complexity is, and how to think about it when solving problems

There is nothing worse than figuring out a solution to a problem, doing the math, writing the code, and then having it fail due to a **TLE (Time Limit Exceeded)**. Luckily before writing the code we can get a rough idea of how fast it will run.

This "rough idea" is called **Time complexity**.

More formally:
>Time complexity tells us the relation between input size and the time it takes for the program to finish running

Most of the time our code can be classified as: 

- `O(1)` - This is the best case scenario, our code will run at the same speed, no matter the input size
- `O(n)` - Our code scales linearly with the input size, this is amazing!
- `O(n log n)` -  Logarithmic scaling, this is still pretty good and what we should aim for when solving most problems
- `O(n^2)` -  Quadratic scaling, this is reserved for small input sizes or large time constraints, usually more complex algorithms fall into this category
- `O(!n), O(n^n)` - These are exponential scaling algorithms, 99% of the time our solution shouldn't even come close to this

### Counting operations: 

Treat every line of code as addition, this means one line of code, one operation, then look at loops, they multiply every operation in them by how long they run for. Looking at the example it will be more clear:
```c++
int main(){

	int a = 0; //this is one operation


	return 0;
}
```
Generally speaking anything that isn't a multiplier isn't even worth counting, so our code(when considering complexity) really looks like this: 
```c++
```


This is fine and all, but how do we know **what is acceptable for a specific problem?**

Look at 2 things:
1. The time limit
2. The input size 

In c++, a good rule of thumb is 10^8 (100 million ) operations per second, so multiply the **worst case scenario input size** with an **educated guess about the complexity**, and if that is below the time limit you are good, otherwise look to optimize.

>As you solve more and more problems, you'll be able to gauge what complexity works for what problem even without doing the math!