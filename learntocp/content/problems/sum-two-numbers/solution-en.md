Read the two integers, add them, and print the result. There is nothing to optimize — the whole task is a single read and a single write.

-g> **Key Idea:** the sum of two values in the range $[-10^9, 10^9]$ can reach $2 \times 10^9$, which exceeds the range of a 32-bit signed integer. Use a 64-bit type for the result.

## Approach

Read `a` and `b` from standard input, compute `a + b` in a 64-bit integer, and write it to standard output.

## Reference solution

solution.cpp
```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    long long a, b;
    cin >> a >> b;
    cout << a + b << "\n";
    return 0;
}
```

## Complexity

Time $O(1)$, memory $O(1)$.
