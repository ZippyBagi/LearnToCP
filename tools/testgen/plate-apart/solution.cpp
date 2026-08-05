#include <bits/stdc++.h>
using namespace std;

typedef long long ll;

struct v{

    ll x, y;
};

ll cross(v a, v b){

    return (a.x * b.y) - (a.y * b.x);
}

ll dot(v a, v b){

    return (a.x * b.x) + (a.y * b.y);
}

// 0 for the upper half of the circle, 1 for the lower one
int half(v a){

    return (a.y < 0 || (a.y == 0 && a.x < 0)) ? 1 : 0;
}

bool byAngle(v a, v b){

    if(half(a) != half(b)) return half(a) < half(b);
    return cross(a, b) > 0;
}

bool same(v a, v b){

    return a.x == b.x && a.y == b.y;
}

int main() {
    iostream::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin >> t;

    while(t--) {

        ll w, h;
        int n;
        cin >> w >> h >> n;

        vector<v> p(n);
        for(int i = 0; i < n; i++) cin >> p[i].x >> p[i].y;

        vector<v> dir;

        for(int i = 0; i + 1 < n; i++) {

            v e = {p[i + 1].x - p[i].x, p[i + 1].y - p[i].y};

            ll g = __gcd(llabs(e.x), llabs(e.y));      // keep only the direction
            e.x /= g;
            e.y /= g;

            dir.push_back(e);
        }

        sort(dir.begin(), dir.end(), byAngle);
        dir.erase(unique(dir.begin(), dir.end(), same), dir.end());

        int m = dir.size();
        bool ok = (m == 1);                            // one direction only - a straight cut

        for(int i = 0; i < m && !ok; i++) {

            v a = dir[i], b = dir[(i + 1) % m];        // neighbours around the circle

            ll c = cross(a, b);

            // the turn from a to b is more than half a circle, or exactly half of it
            if(c < 0 || (c == 0 && dot(a, b) < 0)) ok = true;
        }

        cout << (ok ? "YES" : "NO") << "\n";
    }

    return 0;
}
