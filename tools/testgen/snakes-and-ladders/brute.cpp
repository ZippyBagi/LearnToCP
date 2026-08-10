// Brute force by a different route. Fatal squares are found by simply walking
// the chain of snakes and ladders up to n+1 steps and declaring a cycle if it
// has not stopped by then, instead of by a coloured search. The shortest number
// of throws is then found by repeated relaxation (Bellman-Ford style sweeps)
// instead of a queue. O(n^2 * k) worst case, so small inputs only.
#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; if(scanf("%d",&t)!=1) return 0;
    while(t--){
        int n,k,m; if(scanf("%d %d %d",&n,&k,&m)!=3) return 0;
        vector<int> jmp(n,-1);
        for(int i=0;i<m;i++){ int u,v; if(scanf("%d %d",&u,&v)!=2) return 0; jmp[u]=v; }
        vector<int> land(n,-1);
        for(int v=0;v<n;v++){
            int cur=v, steps=0; bool bad=false;
            while(jmp[cur]!=-1){ cur=jmp[cur]; if(++steps>n){ bad=true; break; } }
            land[v] = bad ? -1 : cur;
        }
        vector<int> d(n,-1); d[0]=0;
        bool ch=true;
        while(ch){ ch=false;
            for(int v=0;v<n;v++){ if(d[v]==-1) continue;
                for(int s=1;s<=k;s++){ if(v+s>n-1) break;
                    int to=land[v+s]; if(to==-1) continue;
                    if(d[to]==-1||d[to]>d[v]+1){ d[to]=d[v]+1; ch=true; } } } }
        printf("%d\n",d[n-1]);
    }
    return 0;
}
