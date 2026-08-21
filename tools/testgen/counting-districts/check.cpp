// Second independent check for counting-districts, for the sizes brute.cpp
// cannot reach. Every district has exactly one SMALLEST numbered city; fix that
// city r, delete every city below r, and count the districts containing r in
// what is left. A different root for every district, a different subgraph each
// time, and a different attribution rule than the reference's "topmost city
// under a root at 1". O(n^2 * k), so only usable off-line.
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
        long long total=0;
        vector<int> par(n+1), seq;
        vector<char> seen(n+1);
        for(int r=1;r<=n;r++){
            seq.clear();
            fill(seen.begin(), seen.end(), 0);
            vector<int> st{r};
            seen[r]=1; par[r]=0;
            while(!st.empty()){
                int v=st.back(); st.pop_back();
                seq.push_back(v);
                for(int to : adj[v]) if(to>=r && !seen[to]){ seen[to]=1; par[to]=v; st.push_back(to); }
            }
            vector<vector<long long>> cnt(n+1);
            for(int i=(int)seq.size()-1;i>=0;i--){
                int v=seq[i];
                vector<long long> cur(2,0); cur[1]=1;
                for(int to : adj[v]){
                    if(to<r || to==par[v] || cnt[to].empty()) continue;
                    vector<long long>& sub = cnt[to];
                    int lim = min((int)(cur.size()+sub.size()-2), k);
                    vector<long long> nxt(lim+1,0);
                    for(int a=1;a<(int)cur.size();a++){
                        if(!cur[a]) continue;
                        nxt[a] = (nxt[a]+cur[a])%MOD;
                        for(int b=1;b<(int)sub.size() && a+b<=lim;b++)
                            nxt[a+b] = (nxt[a+b]+cur[a]*sub[b])%MOD;
                    }
                    cur.swap(nxt);
                }
                cnt[v].swap(cur);
            }
            for(size_t j=1;j<cnt[r].size();j++) total=(total+cnt[r][j])%MOD;
        }
        printf("%lld\n", total);
    }
    return 0;
}
