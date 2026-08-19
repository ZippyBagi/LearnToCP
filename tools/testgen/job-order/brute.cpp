// Brute force: build the lexicographically smallest order with a plain set and a
// full rescan of the ready jobs each step - O(n^2)-ish, no heap. Small tests only.
#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; scanf("%d",&t);
    while(t--){
        int n,m; scanf("%d %d",&n,&m);
        vector<vector<int>> adj(n);
        vector<int> indeg(n,0);
        for(int i=0;i<m;i++){
            int x,y; scanf("%d %d",&x,&y);
            adj[y].push_back(x); indeg[x]++;
        }
        vector<char> done(n,0);
        vector<int> out;
        for(int step=0;step<n;step++){
            int pick=-1;
            for(int v=0;v<n;v++) if(!done[v] && indeg[v]==0){ pick=v; break; } // smallest ready
            if(pick<0) break;
            done[pick]=1; out.push_back(pick);
            for(size_t i=0;i<adj[pick].size();i++) indeg[adj[pick][i]]--;
        }
        for(size_t i=0;i<out.size();i++) printf("%d%c",out[i],i+1<out.size()?' ':'\n');
    }
    return 0;
}
