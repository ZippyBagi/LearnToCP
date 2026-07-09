#include <bits/stdc++.h>
using namespace std;
int main(){
    iostream::sync_with_stdio(false); cin.tie(0);
    int n, W; cin >> n >> W;
    vector<int> wt(n); vector<long long> val(n);
    for(int i = 0; i < n; i++) cin >> wt[i] >> val[i];
    vector<long long> dp(W + 1, 0);
    for(int i = 0; i < n; i++)
        for(int j = W; j >= wt[i]; j--)
            dp[j] = max(dp[j], dp[j - wt[i]] + val[i]);
    cout << dp[W];
}
