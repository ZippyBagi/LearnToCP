#include <bits/stdc++.h>

using namespace std;

int main(){

    cin.tie(0);
    iostream::sync_with_stdio(false);

    int t;
    cin>>t;

    while(t--){

        int n, m, k;
        cin>>n>>m>>k;

        vector<long long> a(n);
        for(int i=0;i<n;i++){
            cin>>a[i];
        }

        vector<vector<long long>> adj(n, vector<long long>(n, 0)); // adj[x][y] = bonus for y right after x

        for(int i=0;i<k;i++){
            long long x, y, z;
            cin>>x>>y>>z;
            x--;
            y--;
            adj[x][y] = z;
        }

        vector<vector<long long>> dp(1<<n, vector<long long>(n, -1)); // -1 means unreachable

        long long ans = 0;

        for(int i=0;i<n;i++){ // a meal that starts with dish i
            dp[1<<i][i] = a[i];
            ans = max(ans, a[i]);
        }

        for(int mask=1;mask<(1<<n);mask++){

            int cnt = __builtin_popcountll(mask);

            if(cnt >= m){ // already a full order, nothing more may be added
                continue;
            }

            for(int last=0;last<n;last++){

                if(dp[mask][last] == -1){
                    continue;
                }

                for(int i=0;i<n;i++){

                    if(mask & (1<<i)){ // dish i is already on the table
                        continue;
                    }

                    int new_mask = mask | (1<<i);

                    dp[new_mask][i] = max(dp[new_mask][i], dp[mask][last] + a[i] + adj[last][i]);

                    ans = max(ans, dp[new_mask][i]);
                }
            }
        }

        cout<<ans<<'\n';
    }
    return 0;
}
