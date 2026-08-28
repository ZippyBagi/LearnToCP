// Brute force: after every added 1, run a fresh BFS from the whole top row and
// see whether it reaches the bottom row. No union-find at all. O(m * n^2).
#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; scanf("%d",&t);
    while(t--){
        int s,m; scanf("%d %d",&s,&m);
        vector<char> one(s*s,0);
        int ans=-1;
        int dr[4]={-1,1,0,0}, dc[4]={0,0,-1,1};
        for(int step=1;step<=m;step++){
            int r,c; scanf("%d %d",&r,&c);
            one[r*s+c]=1;
            if(ans!=-1) continue;
            vector<char> vis(s*s,0);
            deque<int> q;
            for(int j=0;j<s;j++) if(one[j]){ vis[j]=1; q.push_back(j); }
            bool hit=false;
            while(!q.empty()&&!hit){
                int cur=q.front(); q.pop_front();
                int cr=cur/s, cc=cur%s;
                if(cr==s-1){ hit=true; break; }
                for(int d=0;d<4;d++){
                    int nr=cr+dr[d], nc=cc+dc[d];
                    if(nr<0||nr>=s||nc<0||nc>=s) continue;
                    int id=nr*s+nc;
                    if(one[id]&&!vis[id]){ vis[id]=1; q.push_back(id); }
                }
            }
            if(hit) ans=step;
        }
        printf("%d\n",ans);
    }
    return 0;
}
