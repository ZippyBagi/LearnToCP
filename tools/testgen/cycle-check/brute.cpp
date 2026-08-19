// Brute force: DFS three-colouring. A back edge to a vertex still on the
// recursion stack is a cycle. Completely different route from Kahn's counting.
#include <bits/stdc++.h>
using namespace std;
int v,e;
vector<vector<int>> adj;
vector<int> colour; // 0 unvisited, 1 on the stack, 2 finished
bool found;

void dfs(int start){
    // iterative, so a 5000-long chain cannot blow the stack
    vector<pair<int,size_t>> st;
    st.push_back({start,0});
    colour[start]=1;
    while(!st.empty()){
        int node=st.back().first;
        size_t &i=st.back().second;
        if(i<adj[node].size()){
            int to=adj[node][i++];
            if(colour[to]==1){ found=true; return; }
            if(colour[to]==0){ colour[to]=1; st.push_back({to,0}); }
        }else{
            colour[node]=2;
            st.pop_back();
        }
    }
}

int main(){
    int t; scanf("%d",&t);
    while(t--){
        scanf("%d %d",&v,&e);
        adj.assign(v,{});
        for(int i=0;i<e;i++){ int a,b; scanf("%d %d",&a,&b); adj[a].push_back(b); }
        colour.assign(v,0);
        found=false;
        for(int i=0;i<v && !found;i++) if(colour[i]==0) dfs(i);
        printf("%s\n",found?"yes":"no");
    }
    return 0;
}
