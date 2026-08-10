#include <bits/stdc++.h>
using namespace std;

int main() {
    iostream::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin >> t;

    while(t--) {

        int s, n;
        cin >> s >> n;

        vector<vector<int>> route(n);   // route[i] lists the stops of line i
        vector<vector<int>> lines(s+1); // lines[v] lists the lines stopping at v

        for(int i=0;i<n;i++) {

            int m;
            cin >> m;

            route[i].resize(m);

            for(int j=0;j<m;j++) {
                cin >> route[i][j];
                lines[route[i][j]].push_back(i);
            }
        }

        int a, b;
        cin >> a >> b;

        vector<int> dist(s+1, -1);   // dist[v] = fewest rides needed to reach stop v
        vector<bool> used(n, false); // a line is worth boarding only once

        queue<int> q;

        dist[a] = 0;
        q.push(a);

        while(!q.empty()) {

            int v = q.front();
            q.pop();

            for(int i=0;i<lines[v].size();i++) {

                int line = lines[v][i];

                if(used[line]) continue; // every stop of this line is already reached
                used[line] = true;

                for(int j=0;j<route[line].size();j++) {

                    int to = route[line][j];

                    if(dist[to] == -1) { // first time we see it, so this is the fewest rides
                        dist[to] = dist[v] + 1;
                        q.push(to);
                    }
                }
            }
        }

        cout << dist[b] << "\n"; // -1 already means "cannot get there"
    }

    return 0;
}
