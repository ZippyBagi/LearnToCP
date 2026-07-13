#include <bits/stdc++.h>
using namespace std;

int main() {
    iostream::sync_with_stdio(false);
    cin.tie(0);
    int t;
    cin >> t;
    while(t--) {
        int n, a, b;
        cin >> n >> a >> b;
        a = a % n; // position of the first player
        b = b % n; // position of the second player
        cout << (b - a + n) % n << "\n";
    }
    return 0;
}

