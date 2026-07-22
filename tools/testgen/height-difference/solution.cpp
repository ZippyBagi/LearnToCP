#include <bits/stdc++.h>
using namespace std;

int main() {
    iostream::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin >> t;

    while(t--) {

        int n;
        long long r;
        cin >> n >> r;

        vector<long long> a(n);
        for(int i = 0; i < n; i++) cin >> a[i];

        sort(a.begin(), a.end());

        long long cnt = 0;
        int low = 0, high = 0; // both pointers only ever move forward

        for(int i = 0; i < n; i++) {
            while(a[low] < a[i] - r) low++;    // first element >= a[i] - r
            while(a[high] <= a[i] - r) high++; // first element > a[i] - r
            cnt += high - low;                 // elements equal to exactly a[i] - r
        }

        cout << cnt << "\n";
    }

    return 0;
}
