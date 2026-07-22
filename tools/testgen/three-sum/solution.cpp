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

        vector<long long> a(n);
        for(int i = 0; i < n; i++) cin >> a[i];

        sort(a.begin(), a.end());

        long long cnt = 0;

        for(int i = 0; i < n; i++) {

            // count pairs to the right of i whose sum is -a[i]
            int left = i + 1, right = n - 1;

            while(left < right) {
                long long sum = a[i] + a[left] + a[right]; // up to 3 * 10^9, does not fit in an int
                if(sum == 0) {
                    cnt++;
                    left++;
                    right--;
                } else if(sum < 0) left++;
                else right--;
            }
        }

        cout << cnt << "\n";
    }

    return 0;
}
