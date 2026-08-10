#include <bits/stdc++.h>
using namespace std;

void dfs(int v, int altitude, vector<vector<int>>& adj, vector<vector<int>>& diff, int& lowest) {

    lowest = min(lowest, altitude); // this hall may be the deepest one

    for(int i=0;i<adj[v].size();i++) {
        dfs(adj[v][i], altitude + diff[v][i], adj, diff, lowest);
    }
}

int main() {
    iostream::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin >> t;

    while(t--) {

        int h, n;
        cin >> h >> n;

        vector<vector<int>> adj(n+1);  // adj[v] holds the halls the corridors from v lead to
        vector<vector<int>> diff(n+1); // diff[v][i] is the altitude change on that corridor

        for(int i=0;i<n-1;i++) {

            int u, v, d;
            cin >> u >> v >> d;

            adj[u].push_back(v); // the corridor always leads away from the entrance
            diff[u].push_back(d);
        }

        int lowest = h; // the entrance hall is hall 1, and it sits at altitude h

        dfs(1, h, adj, diff, lowest);

        cout << lowest << "\n";
    }

    return 0;
}
