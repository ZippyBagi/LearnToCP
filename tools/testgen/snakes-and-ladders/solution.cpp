#include <bits/stdc++.h>
using namespace std;

int resolve(int v, vector<int>& jump, vector<int>& state, vector<int>& land) {

    if(state[v] == 2) return land[v]; // already known
    if(state[v] == 1) return -1;      // we walked back into v, so v sits on a cycle

    state[v] = 1;

    if(jump[v] == -1) land[v] = v;                      // nothing here, the player stays
    else land[v] = resolve(jump[v], jump, state, land); // he is carried on, wherever that ends up

    state[v] = 2;
    return land[v];
}

int main() {
    iostream::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin >> t;

    while(t--) {

        int n, k, m;
        cin >> n >> k >> m;

        vector<int> jump(n, -1); // jump[v] is where a snake or ladder on v leads, or -1
        vector<int> state(n, 0); // 0 = untouched, 1 = being resolved right now, 2 = finished
        vector<int> land(n, -1); // land[v] is where the player really ends up, or -1 if v is fatal

        for(int i=0;i<m;i++) {

            int u, v;
            cin >> u >> v;

            jump[u] = v;
        }

        for(int v=0;v<n;v++) resolve(v, jump, state, land);

        vector<int> dist(n, -1); // dist[v] = fewest throws needed to stand on v

        queue<int> q;

        dist[0] = 0;
        q.push(0);

        while(!q.empty()) {

            int v = q.front();
            q.pop();

            for(int roll=1;roll<=k;roll++) {

                if(v + roll > n - 1) break; // a throw past the last square is not allowed

                int to = land[v + roll];

                if(to == -1) continue; // that square loses the game, so we never step on it

                if(dist[to] == -1) { // first time we see it, so this is the fewest throws
                    dist[to] = dist[v] + 1;
                    q.push(to);
                }
            }
        }

        cout << dist[n-1] << "\n"; // -1 already means "cannot be done"
    }

    return 0;
}
