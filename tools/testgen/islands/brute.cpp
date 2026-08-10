// Brute force: repeated relabelling. Give every land cell its own label, then
// keep sweeping the grid pulling each cell's label down to the smallest label
// among itself and its four neighbours until nothing changes. The number of
// surviving labels is the number of islands. O((n*m)^2) worst case.
// Completely different route from the DFS - used only to cross-check.
#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; if(scanf("%d",&t)!=1) return 0;
    while(t--){
        int n,m; if(scanf("%d %d",&n,&m)!=2) return 0;
        vector<string> g(n);
        for(int i=0;i<n;i++){ char buf[600]; if(scanf("%s",buf)!=1) return 0; g[i]=buf; }
        vector<vector<int>> lab(n, vector<int>(m,-1));
        int id=0;
        for(int r=0;r<n;r++)for(int c=0;c<m;c++) if(g[r][c]=='#') lab[r][c]=id++;
        int dr[]={-1,1,0,0}, dc[]={0,0,-1,1};
        bool changed=true;
        while(changed){
            changed=false;
            for(int r=0;r<n;r++)for(int c=0;c<m;c++){
                if(g[r][c]!='#') continue;
                for(int k=0;k<4;k++){
                    int nr=r+dr[k],nc=c+dc[k];
                    if(nr<0||nr>=n||nc<0||nc>=m) continue;
                    if(g[nr][nc]!='#') continue;
                    if(lab[nr][nc]<lab[r][c]){ lab[r][c]=lab[nr][nc]; changed=true; }
                }
            }
        }
        map<int,int> cnt;
        for(int r=0;r<n;r++)for(int c=0;c<m;c++) if(g[r][c]=='#') cnt[lab[r][c]]++;
        int largest=0;
        for(map<int,int>::iterator it=cnt.begin();it!=cnt.end();++it) largest=max(largest,it->second);
        printf("%d %d\n",(int)cnt.size(),largest);
    }
    return 0;
}
