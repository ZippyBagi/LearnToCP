#include <bits/stdc++.h>
using namespace std;

struct v{

    long long x, y;
};

int main() {
    iostream::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin >> t;

    while(t--) {

        int n;
        cin >> n;

        vector<v> p(n);
        for(int i = 0; i < n; i++) cin >> p[i].x >> p[i].y;

        // the cabin travels from the first pylon towards the second one
        v d = {p[1].x - p[0].x, p[1].y - p[0].y};

        vector<pair<long long, int>> key(n);

        for(int i = 0; i < n; i++) {

            // dot product of (p[i] - p[0]) and d - how far along the travel direction
            long long along = (p[i].x - p[0].x) * d.x + (p[i].y - p[0].y) * d.y;

            key[i] = {along, i};
        }

        sort(key.begin(), key.end());

        for(int i = 0; i < n; i++) {
            cout << p[key[i].second].x << " " << p[key[i].second].y << "\n";
        }
    }

    return 0;
}
