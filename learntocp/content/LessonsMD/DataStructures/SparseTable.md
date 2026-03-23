#### Problem:

>You are given an integer array arr of length n and an integer q denoting the number of queries. Each query consists of two indices L and R (0 ≤ L ≤ R < n), and asks for the minimum value in the subarray arr\[L…R].
#### Ideja: 

>The idea is to precompute the minimum values for all subarrays whose lengths are **powers of two*** and store them in a table so that any range-minimum query can be answered in constant time. We build a 2D array `lookup` where `lookup[i][j]` holds the minimum of the subarray starting at `i` with length `2^j (`j varies from to Log n where n is the length of the input array). For example `lookup[0][3]` contains minimum of range `[0, 7]` (starting with 0 and of size 23)

![[Pasted image 20260223215427.png]]
We can ignore the cells with out of bounds intervals

![[Pasted image 20260223215714.png]]
We can replace min with out function
![[Pasted image 20260223215935.png]]
> ***How do we handle individual queries?***
> 
> - Find highest power of 2 that is smaller than or equal to count of elements in given range `[L, R]`. we get `j = floor(log2(R - L + 1))` For `[2, 10]`, `j = 3`
> 
> - Compute minimum of last 2^j elements with first 2^j elements in range. For `[2, 10]`, we compare lookup`[0][3]` (minimum from 0 to 7) and lookup`[3][3]` (minimum from 3 to 10) and return the minimum of two values.
#### Kod - O(n log n) - za pravljenje. O(1) - za Query: 

Pravljenje Sparse Table-a
```c++
vector<vector<int>> buildSparseTable(vector<int> &arr) {
    int n = arr.size();

    // create the 2d table
    vector<vector<int>> lookup(n,
                vector<int>(log2(n) + 1));

    // Initialize for the intervals with length 1
    for (int i = 0; i < n; i++)
        lookup[i][0] = arr[i];

    // Compute values from smaller to bigger intervals
    for (int j = 1; (1 << j) <= n; j++) {

        // Compute minimum value for all intervals with
        // size 2^j
        for (int i = 0; i + (1 << j) <= n; i++) {

            if (lookup[i][j - 1] <= lookup[i + (1 << (j - 1))][j - 1]){
	                lookup[i][j] = lookup[i][j - 1];
                }
                
            else{
                lookup[i][j] = lookup[i + (1 << (j - 1))][j - 1];
	        }
        }
    }

    return lookup;
}
```

Query: 
```c++
int query(int L, int R, vector<vector<int>> &lookup)  {

    // Find highest power of 2 that is smaller
    // than or equal to count of elements in range
    int j = (int)log2(R - L + 1);

    // Compute minimum of last 2^j elements with first
    // 2^j elements in range.
    if (lookup[L][j] <= lookup[R - (1 << j) + 1][j])
        return lookup[L][j];
    else
        return lookup[R - (1 << j) + 1][j];
}
```
#### Linkovi:

- Video: https://www.youtube.com/watch?v=uUatD9AudXo

- GFG: https://www.geeksforgeeks.org/dsa/sparse-table/

- Problem: https://www.spoj.com/problems/RMQSQ/
