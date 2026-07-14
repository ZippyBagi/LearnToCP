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
        if(b >= a) cout << b - a << "\n";
        else cout << n - a + b << "\n"; // wrap past field 0
    }
    return 0;
}
