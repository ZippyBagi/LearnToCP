// Brute force by the classic succession rule rather than by a preorder DFS:
// the next in line after v is v's oldest child if he has one, otherwise the
// next younger brother of the nearest ancestor that has one. Walking that
// successor chain from the king lists the whole line. O(n * depth).
#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; if(scanf("%d",&t)!=1) return 0;
    while(t--){
        int n; if(scanf("%d",&n)!=1) return 0;
        map<string,int> id; vector<string> nm;
        vector<vector<int>> ch; vector<int> par; vector<int> pos;
        for(int i=0;i+1<n;i++){
            char A[64],B[64]; if(scanf("%s %s",A,B)!=2) return 0;
            string a=A,b=B;
            if(!id.count(a)){ id[a]=ch.size(); ch.push_back({}); par.push_back(-1); pos.push_back(-1); nm.push_back(a);}
            if(!id.count(b)){ id[b]=ch.size(); ch.push_back({}); par.push_back(-1); pos.push_back(-1); nm.push_back(b);}
            pos[id[b]]=ch[id[a]].size();
            ch[id[a]].push_back(id[b]);
            par[id[b]]=id[a];
        }
        int root=0; for(int v=0;v<n;v++) if(par[v]==-1) root=v;
        vector<int> rk(n,-1);
        int cur=root, c=0;
        while(cur!=-1){
            rk[cur]=c++;
            if(!ch[cur].empty()){ cur=ch[cur][0]; continue; }
            int u=cur, nxt=-1;
            while(u!=root){
                int p=par[u];
                if(pos[u]+1<(int)ch[p].size()){ nxt=ch[p][pos[u]+1]; break; }
                u=p;
            }
            cur=nxt;
        }
        int q; if(scanf("%d",&q)!=1) return 0;
        for(int i=0;i<q;i++){ char A[64]; if(scanf("%s",A)!=1) return 0; printf("%s %d\n",A,rk[id[string(A)]]); }
    }
    return 0;
}
