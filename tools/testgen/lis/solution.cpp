#include <bits/stdc++.h>
using namespace std;
int main(){
    iostream::sync_with_stdio(false); cin.tie(0);
    int n; cin >> n;
    vector<long long> a(n);
    for(int i = 0; i < n; i++) cin >> a[i];
    vector<int> dp(n, 1); // LIS starting at i
    for(int i = n - 1; i >= 0; i--)
        for(int j = i + 1; j < n; j++)
            if(a[j] > a[i]) dp[i] = max(dp[i], dp[j] + 1);
    int k = *max_element(dp.begin(), dp.end());
    cout << k << '\n';
    int pos = -1; long long last = LLONG_MIN;
    for(int need = k; need >= 1; need--){
        int best = -1;
        for(int i = pos + 1; i < n; i++)
            if(dp[i] == need && a[i] > last && (best == -1 || a[i] < a[best]))
                best = i;
        cout << a[best] << " ";
        pos = best; last = a[best];
    }
}
