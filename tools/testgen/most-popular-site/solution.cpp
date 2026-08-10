#include <bits/stdc++.h>
using namespace std;

int main() {
    iostream::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin >> t;

    while(t--) {

        int n, m;
        cin >> n >> m;

        vector<int> pop(n+1, 0); // pop[v] = links into v minus links out of v

        for(int i=0;i<m;i++) {

            int u, v;
            cin >> u >> v;

            if(u == v) continue; // a link from a site to itself is ignored

            pop[v]++; // one more link leading in
            pop[u]--; // one more link leading out
        }

        int best = 1;

        for(int v=2;v<=n;v++) {
            if(pop[v] > pop[best]) best = v; // strict >, so a tie keeps the smaller number
        }

        cout << best << " " << pop[best] << "\n";
    }

    return 0;
}
