#include <bits/stdc++.h>

using namespace std;

int main(){

    cin.tie(0);
    iostream::sync_with_stdio(false);

    int t;
    cin>>t;

    while(t--){

        int n;
        cin>>n;

        vector<int> a(n);
        for(int i=0;i<n;i++){
            cin>>a[i];
            a[i]--;
        }

        // keep only the colours that actually occur, so the table is 2^k and not 2^20
        vector<int> id(20, -1);
        int k = 0;
        for(int i=0;i<n;i++){
            if(id[a[i]] == -1){
                id[a[i]] = k++;
            }
        }
        for(int i=0;i<n;i++){
            a[i] = id[a[i]];
        }

        // cnt[i][j] = pairs of marbles where colour i stands somewhere before colour j
        vector<vector<long long>> cnt(k, vector<long long>(k, 0));
        vector<long long> seen(k, 0);

        for(int i=0;i<n;i++){
            int c = a[i];
            for(int j=0;j<k;j++){
                cnt[j][c] += seen[j]; // every earlier marble of colour j pairs with this one
            }
            seen[c]++;
        }

        // dp[mask] = fewest swaps to put exactly the colours of mask at the front
        vector<long long> dp(1<<k, LLONG_MAX);
        dp[0] = 0;

        for(int mask=0;mask<(1<<k);mask++){

            if(dp[mask] == LLONG_MAX){
                continue;
            }

            for(int c=0;c<k;c++){

                if(mask & (1<<c)){ // colour c is already placed
                    continue;
                }

                long long add = 0;
                for(int j=0;j<k;j++){
                    if(mask & (1<<j)){
                        add += cnt[c][j]; // c must cross every c-before-j pair
                    }
                }

                int next = mask | (1<<c);
                dp[next] = min(dp[next], dp[mask] + add);
            }
        }

        cout<<dp[(1<<k)-1]<<'\n';
    }
    return 0;
}
