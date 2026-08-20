// Brute force: Bellman-Ford. Relaxes every edge n-1 times, no priority queue and
// no "the smallest one is final" argument at all - a completely different route
// to the same distances. O(n*m), so small and medium tests only.
#include <bits/stdc++.h>
using namespace std;
const int INF = 1e9;
int main(){
    int t; scanf("%d",&t);
    while(t--){
        int n,m; scanf("%d %d",&n,&m);
        vector<array<int,3>> e(m);
        for(int i=0;i<m;i++){ scanf("%d %d %d",&e[i][0],&e[i][1],&e[i][2]); e[i][0]--; e[i][1]--; }
        int s; scanf("%d",&s); s--;
        vector<int> d(n,INF);
        d[s]=0;
        for(int it=0;it<n-1;it++){
            bool changed=false;
            for(int i=0;i<m;i++){
                int u=e[i][0], v=e[i][1], w=e[i][2];
                if(d[u]!=INF && d[u]+w<d[v]){ d[v]=d[u]+w; changed=true; }
            }
            if(!changed) break;
        }
        int ans=0;
        for(int i=0;i<n;i++) ans=max(ans,d[i]);
        printf("%d\n", ans==INF ? -1 : ans);
    }
    return 0;
}
