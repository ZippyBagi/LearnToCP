#include <bits/stdc++.h>

using namespace std;

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        int n, m;
        cin>>n>>m;

        vector<vector<int>> adj(n);
        vector<int> indegree(n, 0);

        for(int e=0;e<m;e++){
            int x, y;
            cin>>x>>y;      // y has to be done before x, so the arrow goes y -> x
            adj[y].push_back(x);
            indegree[x]++;
        }

        priority_queue<int, vector<int>, greater<int>> q; // smallest ready job first

        for(int v=0;v<n;v++){
            if(indegree[v]==0){ // nothing has to come before v
                q.push(v);
            }
        }

        vector<int> topo;

        while(!q.empty()){

            int v = q.top();
            q.pop();

            topo.push_back(v);

            for(int i=0;i<adj[v].size();i++){

                int to = adj[v][i];

                indegree[to]--; // one prerequisite of to is finished

                if(indegree[to]==0){ // to is now free to be done
                    q.push(to);
                }
            }
        }

        for(int i=0;i<topo.size();i++){
            cout<<topo[i]<<(i+1<(int)topo.size() ? ' ' : '\n');
        }
    }
    return 0;
}
