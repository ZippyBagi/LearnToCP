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

        vector<long long> a(n); // the values can be up to 10^18, they do not fit in an int
        for(int i = 0; i < n; i++) cin >> a[i];

        while(q--) {

            long long d;
            cin >> d;

            // find the first position where the element is not divisible by d
            int left = 0, right = n; // right = n: maybe every element is divisible

            while(left < right) {
                int middle = (left + right) / 2;
                if(a[middle] % d == 0) left = middle + 1; // the border is right of middle
                else right = middle;                      // middle is not divisible, the border is at middle or left of it
            }

            cout << left << "\n"; // left = number of divisible elements
        }
    }

    return 0;
}
