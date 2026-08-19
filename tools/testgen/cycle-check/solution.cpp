#include <bits/stdc++.h>

using namespace std;

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        int v, e;
        cin>>v>>e;

        vector<vector<int>> adj(v);
        vector<int> indegree(v, 0);

        for(int i=0;i<e;i++){
            int a, b;
            cin>>a>>b;      // a teleporter leads from a to b
            adj[a].push_back(b);
            indegree[b]++;
        }

        queue<int> q;

        for(int i=0;i<v;i++){
            if(indegree[i]==0){ // no teleporter arrives here
                q.push(i);
            }
        }

        int visited = 0;

        while(!q.empty()){

            int node = q.front();
            q.pop();

            visited++;

            for(int i=0;i<adj[node].size();i++){

                int to = adj[node][i];

                indegree[to]--;

                if(indegree[to]==0){
                    q.push(to);
                }
            }
        }

        cout<<(visited < v ? "yes" : "no")<<'\n'; // planets left over means a cycle
    }
    return 0;
}
