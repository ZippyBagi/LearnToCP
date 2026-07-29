#include <bits/stdc++.h>
using namespace std;

int main() {
    iostream::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin >> t;

    while(t--) {

        int n;
        cin >> n;

        map<long long, int> a; // how many times each value appears in the first array

        for(int i = 0; i < n; i++) {
            long long x;
            cin >> x;
            a[x]++;
        }

        int m;
        cin >> m;

        map<long long, int> b;

        for(int i = 0; i < m; i++) {
            long long x;
            cin >> x;
            b[x]++;
        }

        if(a == b) cout << "YES" << "\n";
        else cout << "NO" << "\n";
    }

    return 0;
}
