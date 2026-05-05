 > This lesson will assume that you **don't have any previous knowledge of c++**

In the context of competitive programming, every program will look something like this: 

Solution.cpp
```c++
#include <bits/stdc++.h> // - First we import the libraries we will be using (more on this later)

using namespace std; // We also include the std namespace, this lets us use things like the standard input/output system

// Here is our main function all code starts executing from here
int main(){ 

	// Our logic goes here

	return 0;
}
```
One thing to note is the `return 0` at the end of our main function, it is really important as without it some online judges won't accept the solution even if it is correct. 
### Data types:

In c++, we have a few basic data types you should be familiar with, these are: 

- **int** - for standard integer numbers (32 bit)
- **long long** - for large integer numbers (64 bit)
- **char** - for a singular character on the keyboard (for example `"a"`)
- **string** - for text
- **float** - for decimal numbers (floating point numbers)
- **bool** - for booleans (they can either be true or flase)

There are of course many more which have specific purposes but we will get to them later.
### Input/Output

>When solving a problem, most of the time there will be a **"Standard Input/Output"** or **"Standard I/O"** tag inside of the problem. This means that we are taking information from the console, and writing it to the console.

There are two ways to do this in c++:
#### 1.  scanf() and printf();
>This is the method carried over from the c programming language. 
   
This looks scary and complicated but it is not as bad as it looks: 

For the input we use `scanf("%d", &a)`:
- First the `scanf()` calls the input function
- The `%` means that we want to input something
- The `d` in `%d` means we want to input an **integer** (every data type has its own code)
- Then comes the `&a`, for now you can think of it as we want to put the typed in value **into a**
Put together it looks like this:
~!
```c++
int main(){ 

	int a; //first we initialize a
	scanf("%d", &a); //then we read the value and put it into a

	return 0;
}
```

For the output it is very similar `printf("%d", a)`:
- The `printf()` calls the function
- `%` means we want to print out the value
- `%d` means we want to print out an integer
- And `a` is the value we are printing (Note that we are printing **`a`** and **NOT `&a`** )

The nice thing about `printf()` is that we can put text before and after `%d` 
~!
```c++
int main(){ 

	int a = 13;
	
	printf("The value of a is %d!", a);

	return 0;
}
```
Output: `The value of a is 13!`

Here are the codes for all the data types: 
- **int** - `%d`
- **long long** - `%ll`
- **char** - `"%c"`
- **string** - `%s`
- **float** - `%f`
- **bool** - `%b`

#### 2.  cin>> and cout<<;

>This is the newer and in my opinion simpler approach.

For input we use `cin>>a`:
- The `cin>>` Means we want to input something
- The `a` means we are putting what we get from the console into `a`
~!
```c++
int main(){ 

	int a; //first we initialize a
	cin>>a;

	return 0;
}
```
We can also input multiple variables at once like this: `cin>>a>>b;`

For output we use `cout<<a`:
- Again `cout<<` Calls the print
- And `a` means the value of a

If we want to print multiple things we write `cout<<a<<b;`
~!
```c++
int main(){ 

	int a = 13;
	
	cout<<"The value of a is: "<<a<<"!";

	return 0;
}
```
Output: `The value of a is: 13!`

>One thing to note when using `cin` and `cout` is that they are **SLOWER** than `scanf` and `printf` (more about this later)

In order to speed them up we must type these two lines at the beginning of  our main function: 
	`cin.tie(0);`
	`ios_base::sync_with_stdio(false);`

So the full code would look like this: 

Solution.cpp
```c++
#include <bits/stdc++.h>

using namespace std;
int main(){ 
	
	cin.tie(0);
	ios_base::sync_with_stdio(false);
	
	int a;
	cin>>a;
	
	cout<<"The value of a is: "<<a<<"!";

	return 0;
}
```

>Note : these two lines can be confusing and are often unnecessary, but it is good practice to write them in every solution that uses cin and cout, hence why you will see them in most lectures 

Learn more about them here: https://stackoverflow.com/questions/31162367/significance-of-ios-basesync-with-stdiofalse-cin-tienull