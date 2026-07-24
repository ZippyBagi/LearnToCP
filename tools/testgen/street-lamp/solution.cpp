#include <bits/stdc++.h>
using namespace std;

int main() {
    iostream::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin >> t;

    while(t--) {

        int n, d;
        cin >> n >> d;

        vector<int> x(n); // coordinates within +-10^9, and 2*d up to 2*10^9, both fit in an int
        for(int i = 0; i < n; i++) cin >> x[i];

        sort(x.begin(), x.end());

        int best = 0, left = 0;

        for(int right = 0; right < n; right++) {
            while(x[right] - x[left] > 2 * d) left++; // shrink the window until it fits under one lamp
            best = max(best, right - left + 1);
        }

        cout << best << "\n";
    }

    return 0;
}
