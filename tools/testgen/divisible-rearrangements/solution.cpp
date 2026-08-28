#include <bits/stdc++.h>

using namespace std;

int main(){

    cin.tie(0);
    iostream::sync_with_stdio(false);

    int t;
    cin>>t;

    while(t--){

        long long a1, m;
        cin>>a1>>m;

        string a = to_string(a1);
        sort(a.begin(), a.end()); // equal digits end up next to each other
        int n = a.size();

        // dp[mask][rem] = how many arrangements of exactly the digits in mask
        // leave remainder rem. Sized to this input, not to the worst case.
        vector<vector<long long>> dp(1<<n, vector<long long>(m, 0));
        dp[0][0] = 1;

        for(int mask=0;mask<(1<<n);mask++){
            for(int rem=0;rem<m;rem++){

                if(dp[mask][rem] == 0){
                    continue;
                }

                for(int i=0;i<n;i++){

                    if((mask>>i) & 1){ // digit i is already placed
                        continue;
                    }
                    if(mask == 0 && a[i] == '0'){ // nothing may start with a zero
                        continue;
                    }
                    if(i > 0 && a[i] == a[i-1] && !(mask & (1<<(i-1)))){ // equal digits are placed left to right
                        continue;
                    }

                    int next = mask | (1<<i);
                    int next_rem = (rem * 10 + (a[i] - '0')) % m;

                    dp[next][next_rem] += dp[mask][rem];
                }
            }
        }

        cout<<dp[(1<<n)-1][0]<<'\n';
    }
    return 0;
}
