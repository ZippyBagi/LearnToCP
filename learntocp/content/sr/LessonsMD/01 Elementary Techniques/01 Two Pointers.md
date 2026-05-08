>In this lesson we will learn about one of the most basic, yet efficient optimization techniques :  the two-pointer technique

Despite being called two pointers, this has nothing to do with the data type called "pointer" (more on them in another lesson).

This technique is essentially a unique way to traverse arrays that would usually require comparing every element with every other element. 

In order to demonstrate how it works, let's look at a problem:
### Problem
>Given a number **k** and a sorted array of integers, if there exist two elements whose sum equals k, print them; otherwise, print "-1".

### Brute force solution

The brute force solution is pretty simple, two nested for loops. 
Essentially: "For every element of the array, check if that element and another element add up to k"

Solution.cpp
```c++
#include <bits/stdc++.h>

using namespace std;

int main(){

    cin.tie(0);
    ios_base::sync_with_stdio(false);

    int n,k;

    cin>>k;
    cin>>n;

    vector<int> a(n);

    for(int i=0;i<n;i++){
        cin>>a[i];
    }

    for(int i=0;i<n;i++){
        for(int j=i+1;j<n;j++){
            if(a[i] + a[j] == k){
                cout<<a[i]<<" "<<a[j];
                return 0;
            }
        }
    }

    cout<<-1;

    return 0;
}
```

The time complexity of this solution is **O(n^2)**, but we can do better  

### Two pointers:

Instead of comparing every element with every other element, we can traverse the array in a unique way:

1. First place a pointer at the beginning of the array, lets call it left : `int left = 0;`
2. Then place another one at the end of the array, call it right : `int right = n-1;`
3. Now we can check if `a[left] + a[right] == k`, if that is the case, we found the solution
4. If that's not the case we check if `a[left] + a[right] > k`. 
	If it is then there is no need to check anything else with `a[right]`. Since the array is sorted  `a[left]` is the smallest number we are considering, if that is too large, then anything to the right of `left` will also be too large. That is why we can ignore all those comparisons.
	So we do `right = right - 1;`
5. Another thing to check is if `a[left] + a[right] < k`.
	Following the same logic, `a[right]` is the biggest number we are considering, if that's not enough nothing else with `a[left]` will be. So we do `left = left + 1`
6. We repeat this process until we either **find the solution**, or until **the pointers meet**, so `while(left < right)`.

Putting all this into code we get: 

Solution.cpp
```c++
#include <bits/stdc++.h>

using namespace std;

int main(){

    cin.tie(0);
    ios_base::sync_with_stdio(false);

    int n,k;

    cin>>k;
    cin>>n;

    vector<int> a(n);

    for(int i=0;i<n;i++){
        cin>>a[i];
    }

    int left = 0;
    int right = n-1;

    while(left < right){

        if(a[left] + a[right] == k){
        
            cout<<a[left]<<" "<<a[right];
            return 0;
        
        }else if(a[left] + a[right] > k){
        
		    right = right - 1;

        }else if(a[left] + a[right] < k){
        
            left = left + 1;
        }

    }

    cout<<-1;

    return 0;
}
```
The time complexity of this solution is **O(n)**.

>Note: If the array weren't sorted, the bure force solution would remain **O(n^2)**, but the 2 pointer one would have to account for sorting which is **O(n log n)**