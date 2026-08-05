// brute.cpp - independent reference for the plate-apart problem.
//
// The set of slide directions that work is
//     C = { d : cross(d, e_i) >= 0 for every cut segment e_i },
// an intersection of closed half planes through the origin, so it is a closed
// convex cone. If it holds anything besides the origin then it has a boundary
// ray, and every boundary ray lies along one of the lines cross(d, e_i) = 0,
// which means along +e_i or -e_i. So trying those 2*(n-1) candidates settles it.
//
// O(n^2) on purpose, and it never sorts or reasons about angles, so it shares
// no code path with solution.cpp.
#include <bits/stdc++.h>
using namespace std;

typedef long long ll;

struct P { ll x, y; };

ll cross(P a, P b) { return a.x * b.y - a.y * b.x; }

int main() {

    int t;
    if(scanf("%d", &t) != 1) return 0;

    while(t--) {

        ll w, h;
        int n;
        if(scanf("%lld %lld %d", &w, &h, &n) != 3) return 0;

        vector<P> p(n);
        for(int i = 0; i < n; i++) {
            if(scanf("%lld %lld", &p[i].x, &p[i].y) != 2) return 0;
        }

        vector<P> e;
        for(int i = 0; i + 1 < n; i++) e.push_back({p[i + 1].x - p[i].x, p[i + 1].y - p[i].y});

        bool ok = false;

        for(int i = 0; i < (int)e.size() && !ok; i++) {
            for(int s = -1; s <= 1 && !ok; s += 2) {

                P d = {s * e[i].x, s * e[i].y};

                bool good = true;
                for(int j = 0; j < (int)e.size() && good; j++)
                    if(cross(d, e[j]) < 0) good = false;

                if(good) ok = true;
            }
        }

        printf("%s\n", ok ? "YES" : "NO");
    }

    return 0;
}
