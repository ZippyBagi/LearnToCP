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

        vector<int> a(n);
        for(int i = 0; i < n; i++) cin >> a[i];

        multiset<int> win(a.begin(), a.begin() + d);   // the first d transactions
        auto mid = next(win.begin(), d / 2);           // the element of rank d/2

        int warnings = 0;

        for(int i = d; i < n; i++) {

            int twiceMedian;
            if(d % 2 == 1) twiceMedian = 2 * (*mid);
            else twiceMedian = *prev(mid) + *mid;

            if(a[i] >= twiceMedian) warnings++;

            win.insert(a[i]);
            if(a[i] < *mid) mid--;          // everything from mid on moved one place right
            if(a[i - d] <= *mid) mid++;     // everything from mid on is about to move left
            win.erase(win.lower_bound(a[i - d])); // the first copy, so it is never mid itself
        }

        cout << warnings << "\n";
    }

    return 0;
}
