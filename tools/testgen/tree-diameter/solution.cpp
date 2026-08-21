#include <bits/stdc++.h>

using namespace std;

int n;
vector<vector<int>> adj;
vector<int> dist;

void addEdge(int u, int v){
    adj[u].push_back(v);
    adj[v].push_back(u);
}

//fills dist with the number of trails from start to every outpost, and returns
//the outpost that ends up farthest away
int bfs(int start){

    queue<int> q;

    dist = vector<int>(n + 1, -1); //-1 means not reached yet, so no visited vector is needed

    dist[start] = 0;
    q.push(start);

    int farthest = start;

    while(!q.empty()){

        int v = q.front();
        q.pop();

        if(dist[v] > dist[farthest]){
            farthest = v;
        }

        for(int i=0;i<adj[v].size();i++){

            int to = adj[v][i];

            if(dist[to] == -1){ //mark it now, not when it leaves the queue
                dist[to] = dist[v] + 1;
                q.push(to);
            }
        }
    }

    return farthest;
}

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        cin>>n;

        adj = vector<vector<int>>(n + 1); // a fresh tree for every testcase

        for(int i=0;i<n-1;i++){
            int u, v;
            cin>>u>>v;
            addEdge(u, v);
        }

        int u = bfs(1); //the farthest outpost from anywhere is one end of a longest route
        int v = bfs(u); //so measuring from u gives the whole route

        cout<<dist[v]<<'\n';
    }
    return 0;
}
