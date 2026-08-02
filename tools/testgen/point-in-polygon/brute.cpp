// Independent reference for point-in-polygon: instead of the horizontal ray and
// the half-open vertex rule, this shoots a ray in a random direction and solves
// each ray/edge crossing exactly in 128-bit rationals. Any degeneracy (a vertex
// exactly on the ray, or an edge collinear with it) is not handled - the
// direction is simply resampled. Used only to cross-check solution.cpp.
#include <bits/stdc++.h>
using namespace std;

typedef __int128 lll;

struct v {
    long long x, y;
};

lll crs(lll ax, lll ay, lll bx, lll by) { return ax * by - ay * bx; }

// boundary test written the other way round: collinear, and the two vectors
// from p to the endpoints point in opposite directions
bool onSegment(v a, v b, v p) {

    lll ax = a.x - p.x, ay = a.y - p.y;
    lll bx = b.x - p.x, by = b.y - p.y;

    if(crs(ax, ay, bx, by) != 0) return false;

    return ax * bx + ay * by <= 0;
}

int main(int argc, char **argv) {
    iostream::sync_with_stdio(false);
    cin.tie(0);

    mt19937_64 rng(12345);

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
        for(int i = 0; i < n && !inside; i++)
            if(onSegment(p[i], p[(i + 1) % n], q)) inside = true;

        while(!inside) {

            lll dx = (long long)(rng() % 2000001) - 1000000;
            lll dy = (long long)(rng() % 2000001) - 1000000;
            if(dx == 0 && dy == 0) continue;

            int crossings = 0;
            bool degenerate = false;

            for(int i = 0; i < n && !degenerate; i++) {

                v a = p[i], b = p[(i + 1) % n];
                lll ex = b.x - a.x, ey = b.y - a.y;
                lll qx = a.x - q.x, qy = a.y - q.y;

                lll den = crs(dx, dy, ex, ey);

                if(den == 0) {                      // parallel to the ray
                    if(crs(qx, qy, dx, dy) == 0) degenerate = true;  // and on it
                    continue;
                }

                lll sNum = crs(qx, qy, ex, ey);     // ray parameter, >= 0 wanted
                lll uNum = crs(qx, qy, dx, dy);     // edge parameter, in (0,1)

                lll d = den;
                if(d < 0) { d = -d; sNum = -sNum; uNum = -uNum; }

                if(uNum == 0 || uNum == d) { degenerate = true; break; }  // hits a vertex
                if(sNum <= 0) continue;

                if(0 < uNum && uNum < d) crossings++;
            }

            if(degenerate) continue;

            inside = (crossings % 2 == 1);
            break;
        }

        cout << (inside ? "YES" : "NO") << "\n";
    }

    return 0;
}
