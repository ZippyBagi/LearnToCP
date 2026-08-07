// Brute force for no-adjacent-ones, used only for cross-checking.
//
// Walks all 2^n bitmasks in increasing order and prints the ones with no two
// adjacent set bits. Reading a mask with bit n-1-j as position j means
// increasing mask order is exactly the increasing array order the statement
// asks for, so this checks the ordering as well as the contents.
#include <bits/stdc++.h>

using namespace std;

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 1;

    for (int mask = 0; mask < (1 << n); mask++) {
        if (mask & (mask << 1)) continue; // two adjacent set bits
        for (int j = 0; j < n; j++) {
            if (j) putchar(' ');
            putchar('0' + ((mask >> (n - 1 - j)) & 1));
        }
        putchar('\n');
    }
    return 0;
}
