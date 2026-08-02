#include <bits/stdc++.h>
using namespace std;

struct v {
    long long x, y;
};

char orientation(v a, v b, v c) {

    // cross product of AB and AC - only its sign matters
    long long prod = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);

    if(prod > 0) return '+';
    if(prod < 0) return '-';
    return '=';
}

bool onSegment(v a, v b, v p) {

    if(orientation(a, b, p) != '=') return false;

    return min(a.x, b.x) <= p.x && p.x <= max(a.x, b.x) &&
           min(a.y, b.y) <= p.y && p.y <= max(a.y, b.y);
}

bool crossesToTheRight(v a, v b, v t) {

    if((a.y > t.y) == (b.y > t.y)) return false; // the edge does not straddle t's height

    char o = orientation(a, b, t);

    return (b.y > a.y) ? (o == '+') : (o == '-'); // is the crossing right of t
}

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

        v q;
        cin >> q.x >> q.y;

        bool inside = false;
        int crossings = 0;

        for(int i = 0; i < n; i++) {
            int j = (i + 1) % n;

            if(onSegment(p[i], p[j], q)) { // on the fence - counts as inside
                inside = true;
                break;
            }

            if(crossesToTheRight(p[i], p[j], q)) crossings++;
        }

        if(!inside) inside = (crossings % 2 == 1);

        cout << (inside ? "YES" : "NO") << "\n";
    }

    return 0;
}
