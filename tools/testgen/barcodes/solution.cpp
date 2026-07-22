#include <bits/stdc++.h>
using namespace std;

int main() {
    iostream::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin >> t;

    while(t--) {

        int n, q;
        cin >> n >> q;

        vector<int> a(n);
        for(int i = 0; i < n; i++) cin >> a[i]; // already sorted

        int cnt = 0;

        while(q--) {

            int k;
            cin >> k;

            int left = 0, right = n - 1;
            bool found = false;

            while(left <= right) {
                int middle = (left + right) / 2;
                if(a[middle] == k) {
                    found = true;
                    break;
                } else if(k > a[middle]) left = middle + 1; // no value left of middle can be k
                else right = middle - 1;                    // no value right of middle can be k
            }

            if(found) cnt++;
        }

        cout << cnt << "\n";
    }

    return 0;
}
