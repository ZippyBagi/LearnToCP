// Independent reference for segment-intersection: solves the parametric system
// with exact 128-bit rational arithmetic instead of comparing orientations.
// Used only to cross-check solution.cpp, never to produce .out files.
#include <bits/stdc++.h>
using namespace std;

typedef __int128 lll;

struct v {
    long long x, y;
};

lll crs(lll ax, lll ay, lll bx, lll by) { return ax * by - ay * bx; }

// is num/den inside [0, 1] ? den is guaranteed non-zero
bool inUnit(lll num, lll den) {
    if(den < 0) { den = -den; num = -num; }
    return 0 <= num && num <= den;
}

bool intersect(v a, v b, v c, v d) {

    lll rx = b.x - a.x, ry = b.y - a.y;   // direction of ab
    lll sx = d.x - c.x, sy = d.y - c.y;   // direction of cd
    lll qx = c.x - a.x, qy = c.y - a.y;   // from a to c

    lll den = crs(rx, ry, sx, sy);

    if(den != 0) {
        lll tNum = crs(qx, qy, sx, sy);   // a + t*r
        lll uNum = crs(qx, qy, rx, ry);   // c + u*s
        return inUnit(tNum, den) && inUnit(uNum, den);
    }

    if(crs(qx, qy, rx, ry) != 0) return false; // parallel, different lines

    // collinear: project c and d onto ab and overlap the two 1d intervals
    lll rr = rx * rx + ry * ry;
    lll t0 = qx * rx + qy * ry;
    lll t1 = t0 + (sx * rx + sy * ry);
    if(t0 > t1) swap(t0, t1);

    return t0 <= rr && 0 <= t1;
}

int main() {
    iostream::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin >> t;

    while(t--) {

        v a, b, c, d;
        cin >> a.x >> a.y >> b.x >> b.y >> c.x >> c.y >> d.x >> d.y;

        cout << (intersect(a, b, c, d) ? "YES" : "NO") << "\n";
    }

    return 0;
}
