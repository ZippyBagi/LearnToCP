// Brute force: build the stop-to-stop graph explicitly (every pair of stops on
// the same line joined by an edge) and BFS over it, counting rides as the
// number of times the line changes is NOT tracked - instead one edge = one ride,
// which is the same thing because riding one line from any of its stops to any
// other costs exactly one ride. O(sum m^2), so small inputs only.
#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; if(scanf("%d",&t)!=1) return 0;
    while(t--){
        int s,n; if(scanf("%d %d",&s,&n)!=2) return 0;
        vector<vector<int>> g(s+1);
        for(int i=0;i<n;i++){
            int m; if(scanf("%d",&m)!=1) return 0;
            vector<int> r(m);
            for(int j=0;j<m;j++) if(scanf("%d",&r[j])!=1) return 0;
            for(int x=0;x<m;x++)for(int y=0;y<m;y++) if(x!=y) g[r[x]].push_back(r[y]);
        }
        int a,b; if(scanf("%d %d",&a,&b)!=2) return 0;
        vector<int> d(s+1,-1); queue<int> q; d[a]=0; q.push(a);
        while(!q.empty()){ int v=q.front(); q.pop();
            for(size_t i=0;i<g[v].size();i++){ int to=g[v][i];
                if(d[to]==-1){ d[to]=d[v]+1; q.push(to); } } }
        printf("%d\n",d[b]);
    }
    return 0;
}
