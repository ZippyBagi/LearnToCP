>In this lecture we will talk about matrices - or vectors of vectors

### Theory

Matrices are 2D arrays, we can think of them as grids, where each field stores a value. 
### Implementation

A matrix of size n rows and m columns is written like : `vector<vector<data_type>> name_of_the_matrix(n, vector<data_type>(m, default_value));`

Lets unpack this: 
- `vector<vector<data_type>>` - is how we declare the matrix
- `name_of_the_matrix` - is the name of the matrix
- `n` - is the number of rows our matrix will have
- `vector<data_type>(m, default_value)` - is what each column will look like, this is a vector

We can also access the element in row **i** and column **j** with: `a[i][j]`
Just like vectors, matrices are 0 indexed by default, this means that the value in the second row and third column is in `a[3][4]`

Example code which shows the i and j values of each field:

Solution.cpp
```c++
#include <bits/stdc++.h>

using namespace std;
int main(){

    int n = 3;
    int m = 4;

    vector<vector<string>> a(n, vector<string>(m)); //We initialize the matrix

    for(int i=0;i<n;i++){ //this means for each row
        for(int j=0;j<m;j++){ //this means for each column in the row
        
            a[i][j] = "(" + to_string(i) + ", " + to_string(j) + ")"; //to_string turns our counter which is an integer into a string, the rest is just formatting
        
        }
    }

    for(int i=0;i<n;i++){
        for(int j=0;j<m;j++){
            cout<<a[i][j]<<" ";
        }
        cout<<'\n'; // new line character(like enter)
    }

    return 0;
}
```
Output:
`(0, 0) (0, 1) (0, 2) (0, 3)`
`(1, 0) (1, 1) (1, 2) (1, 3)`
`(2, 0) (2, 1) (2, 2) (2, 3)`
