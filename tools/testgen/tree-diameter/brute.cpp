// Independent check for tree-diameter: run a BFS from every outpost and keep the
// largest distance seen anywhere. O(n^2), and it uses none of the two-search
// argument - it simply measures every pair.
#include <bits/stdc++.h>
using namespace std;

int main(){
    int t;
    if(scanf("%d",&t)!=1) return 0;
    while(t--){
        int n;
        scanf("%d",&n);
        vector<vector<int>> adj(n+1);
        for(int i=0;i<n-1;i++){
            int u,v; scanf("%d %d",&u,&v);
            adj[u].push_back(v);
            adj[v].push_back(u);
        }
        int best = 0;
        vector<int> d(n+1), q(n);
        for(int s=1;s<=n;s++){
            fill(d.begin(), d.end(), -1);
            int head=0, tail=0;
            d[s]=0; q[tail++]=s;
            while(head<tail){
                int v=q[head++];
                if(d[v]>best) best=d[v];
                for(int to : adj[v]) if(d[to]==-1){ d[to]=d[v]+1; q[tail++]=to; }
            }
        }
        printf("%d\n", best);
    }
    return 0;
}
