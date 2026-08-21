// Exhaustive check for counting-districts: enumerate every subset of the cities
// and test connectivity directly with a flood fill. Shares nothing with the
// reference - no dp, no rooting, no merging. Only usable up to n <= 20.
#include <bits/stdc++.h>
using namespace std;
const long long MOD = 1e9 + 7;

int main(){
    int t;
    if(scanf("%d",&t)!=1) return 0;
    while(t--){
        int n,k;
        scanf("%d %d",&n,&k);
        vector<vector<int>> adj(n+1);
        for(int i=0;i<n-1;i++){
            int u,v; scanf("%d %d",&u,&v);
            adj[u].push_back(v);
            adj[v].push_back(u);
        }
        if(n > 20){ printf("SKIP\n"); continue; }
        long long total = 0;
        for(int mask=1; mask < (1<<n); mask++){
            int sz = __builtin_popcount(mask);
            if(sz > k) continue;
            // flood fill from the lowest set bit, staying inside the mask
            int start = __builtin_ctz(mask) + 1;
            vector<int> seen(n+1,0);
            vector<int> st{start};
            seen[start]=1;
            int reached=0;
            while(!st.empty()){
                int v = st.back(); st.pop_back();
                reached++;
                for(int to : adj[v])
                    if((mask>>(to-1))&1) if(!seen[to]){ seen[to]=1; st.push_back(to); }
            }
            if(reached == sz) total = (total + 1) % MOD;
        }
        printf("%lld\n", total);
    }
    return 0;
}
