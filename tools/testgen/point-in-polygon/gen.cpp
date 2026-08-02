// gen <test_id> - prints one .in file for the point-in-polygon problem to stdout.
//
// Three families of simple polygons, all simple by construction:
//   hull      - convex hull of random points
//   staircase - monotone steps up and to the right, closed along the top and left
//   cshape    - the wide letter C from the statement example, scaled
#include <bits/stdc++.h>
using namespace std;

typedef long long ll;

mt19937_64 rng;

ll rnd(ll lo, ll hi) { return lo + (ll)(rng() % (unsigned long long)(hi - lo + 1)); }

struct P { ll x, y; };

ll cross(P o, P a, P b) {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

vector<P> hull(vector<P> pts) {

    sort(pts.begin(), pts.end(), [](P a, P b) {
        return a.x != b.x ? a.x < b.x : a.y < b.y;
    });
    pts.erase(unique(pts.begin(), pts.end(),
                     [](P a, P b) { return a.x == b.x && a.y == b.y; }), pts.end());

    if(pts.size() < 3) return {};

    vector<P> h;
    for(int pass = 0; pass < 2; pass++) {
        size_t start = h.size();
        for(P q : pts) {
            while(h.size() >= start + 2 && cross(h[h.size() - 2], h[h.size() - 1], q) <= 0)
                h.pop_back();
            h.push_back(q);
        }
        h.pop_back();
        reverse(pts.begin(), pts.end());
    }
    if(h.size() < 3) return {};
    return h;
}

// steps of width/height `s`, k of them, then back along the top and the left
vector<P> staircase(int k, ll s, ll ox, ll oy) {

    vector<P> p;
    p.push_back({ox, oy});
    for(int i = 0; i < k; i++) {
        p.push_back({ox + (i + 1) * s, oy + i * s});
        p.push_back({ox + (i + 1) * s, oy + (i + 1) * s});
    }
    p.push_back({ox, oy + k * s});
    return p;
}

vector<P> cshape(ll s, ll ox, ll oy) {
    return {{ox, oy}, {ox + 5 * s, oy}, {ox + 5 * s, oy + s}, {ox + s, oy + s},
            {ox + s, oy + 3 * s}, {ox + 5 * s, oy + 3 * s}, {ox + 5 * s, oy + 4 * s}, {ox, oy + 4 * s}};
}

void emit(const vector<P> &p, P q) {
    printf("%d\n", (int)p.size());
    for(P a : p) printf("%lld %lld\n", a.x, a.y);
    printf("%lld %lld\n", q.x, q.y);
}

// a point of interest for this polygon: a vertex, a point on an edge, or random
P probe(const vector<P> &p, ll lo, ll hi) {

    int kind = (int)rnd(0, 3);
    int i = (int)rnd(0, (ll)p.size() - 1);
    int j = (i + 1) % (int)p.size();

    if(kind == 0) return p[i];                                  // exactly a corner
    if(kind == 1) {                                             // midpoint if it is a lattice point
        ll mx = p[i].x + p[j].x, my = p[i].y + p[j].y;
        if(mx % 2 == 0 && my % 2 == 0) return {mx / 2, my / 2};
    }
    return {rnd(lo, hi), rnd(lo, hi)};                          // anywhere in the box
}

int main(int argc, char **argv) {

    int id = atoi(argv[1]);
    rng.seed(778241 + id);

    if(id == 2) {
        // many tiny convex polygons in a small box - corners and edges get hit constantly
        vector<pair<vector<P>, P>> cases;
        while((int)cases.size() < 1000) {
            int m = (int)rnd(3, 9);
            vector<P> pts;
            for(int i = 0; i < m; i++) pts.push_back({rnd(-20, 20), rnd(-20, 20)});
            vector<P> h = hull(pts);
            if(h.empty()) continue;
            cases.push_back({h, probe(h, -22, 22)});
        }
        printf("%d\n", (int)cases.size());
        for(auto &c : cases) emit(c.first, c.second);
    }
    else if(id == 3) {
        // staircases - the ray runs into a lot of corners head on
        int t = 300;
        printf("%d\n", t);
        for(int i = 0; i < t; i++) {
            int k = (int)rnd(2, 40);
            ll s = rnd(1, 3);
            vector<P> p = staircase(k, s, rnd(-50, 50), rnd(-50, 50));
            emit(p, probe(p, -60, 60 + k * s));
        }
    }
    else if(id == 4) {
        // the same shapes blown up to the coordinate limit - int overflows here
        int t = 200;
        printf("%d\n", t);
        for(int i = 0; i < t; i++) {
            ll s = rnd(100000000LL, 200000000LL);
            vector<P> p = (i % 2 == 0) ? cshape(s, rnd(-1000000000LL, -900000000LL), rnd(-1000000000LL, -900000000LL))
                                       : staircase((int)rnd(2, 8), s, rnd(-900000000LL, -500000000LL), rnd(-900000000LL, -500000000LL));
            emit(p, probe(p, -1000000000LL, 1000000000LL));
        }
    }
    else if(id == 5) {
        // deliberately degenerate: the ray leaves along a horizontal edge, grazes a
        // corner, or the point sits on a corner
        vector<pair<vector<P>, P>> cases;
        vector<P> c = cshape(1, 0, 0);
        for(P q : {P{0, 0}, P{5, 1}, P{3, 1}, P{1, 2}, P{0, 2}, P{2, 2}, P{5, 4}, P{-1, 0}, P{6, 2}, P{0, 4}})
            cases.push_back({c, q});
        vector<P> s = staircase(4, 2, 0, 0);
        for(P q : {P{0, 0}, P{8, 8}, P{2, 1}, P{1, 1}, P{4, 3}, P{0, 8}, P{9, 4}, P{-1, 4}})
            cases.push_back({s, q});
        vector<P> thin = {{0, 0}, {1000, 1}, {2000, 0}, {2000, 2}, {1000, 3}, {0, 2}};
        for(P q : {P{1000, 1}, P{1000, 2}, P{0, 1}, P{2000, 1}, P{500, 1}})
            cases.push_back({thin, q});
        printf("%d\n", (int)cases.size());
        for(auto &c2 : cases) emit(c2.first, c2.second);
    }
    else {
        // a few big polygons, small coordinates
        int t = 6;
        printf("%d\n", t);
        for(int i = 0; i < t; i++) {
            vector<P> p = staircase(4000 + i * 900, 1, 0, 0);
            emit(p, probe(p, -5, 9000));
        }
    }

    return 0;
}
