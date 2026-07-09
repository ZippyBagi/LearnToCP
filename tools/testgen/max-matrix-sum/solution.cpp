#include <bits/stdc++.h>
using namespace std;
int main(){
    iostream::sync_with_stdio(false); cin.tie(0);
    int n, m; cin >> n >> m;
    vector<vector<int>> a(n, vector<int>(m));
    for(int i = 0; i < n; i++) for(int j = 0; j < m; j++) cin >> a[i][j];
    vector<vector<int>> dp(n, vector<int>(m, 0));
    for(int i = 0; i < n; i++){
        for(int j = 0; j < m; j++){
            if(i == 0 && j == 0){ dp[i][j] = a[i][j]; continue; }
            int best_prev = -1;
            if(i > 0) best_prev = max(best_prev, dp[i-1][j]);
            if(j > 0) best_prev = max(best_prev, dp[i][j-1]);
            dp[i][j] = a[i][j] + best_prev;
        }
    }
    cout << dp[n-1][m-1];
}
