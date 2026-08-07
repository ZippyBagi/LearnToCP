// Reference solution for morse-sequence.
//
// Once the block of length p = 2^k is done, positions p+1..2p are that block
// inverted, so a(n) = 1 - a(n - p) with p the largest power of two below n,
// and a(1) = 1.
#include <bits/stdc++.h>

using namespace std;

typedef unsigned long long ull;

int digitAt(ull n) {
    if (n == 1) return 1;
    ull p = 1;
    while ((p << 1) < n) p <<= 1;
    return 1 - digitAt(n - p);
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin >> t;
    while (t--) {
        ull n;
        cin >> n;
        cout << digitAt(n) << '\n';
    }
    return 0;
}
