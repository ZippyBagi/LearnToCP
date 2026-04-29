>In this lecture we will learn about the main array like data structure in c++ - vectors

### Vectors

Vectors are dynamic sized arrays; this means that we can resize them freely at runtime, and still access all elements in **O(1)**. We can also add and remove elements from either side!

They are declared like this `vector<data_type> name_of_the_vector(n, default_value)`
- `data_type` and `name_of_the_vector` are self explanatory.
- `n` and `default_value` are optional, but if they are provided, the vector will start with `n` elements and each element will be `default_value`
- Note that if we include `n`, but don't include the value, the vector will be filled with zero like elements, depending on the data type they are `0`, `""`, etc..

We can access the i-th element of the vector with `a[i]`, where a is the name of our vector

Example:
~!
```c++
int main(){

    int n = 3;

    vector<int> a(n); //we initialize the vector a with size n

    for(int i =0;i<n;i++){ //notice how we start counting from 0
    
        cin>>a[i]; //we input the i-th element
    }

    cout<<"The third element of the vector is "<<a[2]; //notice how the third element is indexed with a[2]

    return 0;
}
```
`Input: 6 7 8`
`Output: The third element of the vector is 8`

Whilst the vector does start from 0, there is nothing stopping us from ignoring a[0] and using `a[1]` as the first element. 

We do need to make a few more changes so the code now looks like:
~!
```c++
int main(){

    int n = 3;

    vector<int> a(n+1); //If we start counting from 1, we need n+1 elements

    for(int i =1;i<=n;i++){ //Notice how we use i<=n 
    
        cin>>a[i]; //we input the i-th element
    }

    cout<<"The third element of the vector is "<<a[3]; //Now the index of the third element is a[3]

    return 0;
}
```
`Input: 6 7 8`
`Output: The third element of the vector is 8`

### Functions with vectors

There are a lot of useful built-in functions that vectors have.
For doing things like adding an element to the back of the vector, removing elements, and more

The most important ones are (assuming a is a `vector<int>`):  
- `a.push_back(x);` - adds x to the back of the vector, so if we had `[1,2,3]` and we call the function with `a.push_back(4)`, the vector will look like : `[1,2,3,4]`
- `a.pop_back();` - We remove the last element of the vector, so `[1,2,3]` becomes `[1,2]`
- `a.size()` - Returns the length of the vector

Example:

Solution.cpp
```c++
#include <bits/stdc++.h>

using namespace std;
int main(){

    int n = 3;

    vector<int> a(n);

    a[0] = 1;
    a[1] = 2;
    a[2] = 3;

    for(int i=0;i<a.size();i++){ //notice the a.size()
        cout<<a[i]<<" "; // this prints out the vector
    }
    cout<<'\n'; // this is a newline character, like pressing enter on a keyboard

    a.push_back(4);
    a.push_back(5);

    for(int i=0;i<a.size();i++){
        cout<<a[i]<<" ";
    }
    cout<<'\n';

    a.pop_back();

    for(int i=0;i<a.size();i++){
        cout<<a[i]<<" ";
    }
    cout<<'\n';

    return 0;
}
```
Output: 
`1 2 3`
`1 2 3 4 5`
`1 2 3 4`