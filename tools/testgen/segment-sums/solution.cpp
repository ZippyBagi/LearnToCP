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

        vector<long long> pref(n + 1, 0); // pref[i] = sum of the first i elements

        for(int i = 0; i < n; i++) {
            long long x;
            cin >> x;
            pref[i + 1] = pref[i] + x;
        }

        int m;
        cin >> m;

        while(m--) {
            int a, b;
            cin >> a >> b;
            cout << pref[b + 1] - pref[a] << "\n"; // sum of elements a..b
        }
    }

    return 0;
}
