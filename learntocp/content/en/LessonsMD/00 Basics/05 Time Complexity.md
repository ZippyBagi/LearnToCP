>This lesson will focus on learning what time complexity is, and how to think about it when solving problems

A common issue in competitive programming is having a correct solution that fails due to **TLE (Time Limit Exceeded)**.

Understanding why this happens and how to fix it means understanding the **Time complexity** of the solution.

More formally:
>Time complexity describes the relationship between input size and how the runtime of an algorithm grows.

Most of the time our code can be classified as: 

- `O(1)` - Our code will run at the same speed, no matter the input size
- `O(n)` - Our code scales linearly with the input size
- `O(n log n)` -  Linearithmic scaling(n times Logarithmic scaling)
- `O(n^2)` -  Quadratic scaling, this is reserved for small input sizes or large time constraints.
- `O(n!), O(n^n), O(2^n)` - These are exponential (or worse) scaling algorithms
![[big-o.jpg]]
For most problems O(n log n) is the target
### Counting operations: 

Roughly treat each basic operation as constant time., this means one line of code, one operation, then look at loops, they multiply every operation in them by how long they run for. Looking at the example it will be more clear:

Solution.cpp
```c++
int main(){

	cin.tie(0);  
	ios_base::sync_with_stdio(false);
	
	int n;
	cin>>n; //this is one operation
	
	int sum =0;
	for(int i=0;i<n;i++){ // the outer loop runs n times
		for(int j=0;j<n;j++){ // the inner loop also runs n times
		
			sum++; //this is one operation
		
		}
	}
	
	cout<<sum;

	return 0;
}
```
`Input: 5`
`Output: 25`

Looking at the input/output it is pretty clear that this code runs in O(n^2). 

>Generally speaking when trying to get an idea of complexity we focus on repeating parts of code, not the constants, so our code (when considering complexity) really looks like this: 

~!
```c++
int main(){
	for(int i=0;i<n;i++){
		for(int j=0;j<n;j++){
		}
	}
}
```

In this example it was pretty obvious what the complexity is, but oftentimes it won't be that easy, but that's fine since getting an exact number is **never necessary**, a good, thought out guess will always be sufficient.
### Application

How do we know **what is acceptable for a specific problem?**

Look at 2 things:
1. The time limit
2. The input size 

A common rule of thumb in c++ is 10^8 ( 100 million ) operations per second (can vary depending on the compiler), so multiply the **worst case scenario input size** with an **educated guess about the complexity**, and if that is below the time limit you are good, otherwise look to optimize.

>As you solve more and more problems, you'll be able to gauge what complexity works for what problem even without doing the math!
