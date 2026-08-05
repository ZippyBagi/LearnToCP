// gen <test_id> - prints one .in file for the triangle-quadrants problem to stdout.
//
// Families:
//   tiny   - random triangles in a box of side 6, so vertices land on the axes
//            and on the origin constantly
//   box    - random triangles in a larger box
//   limit  - vertices at the coordinate limit, so the cross products overflow int
//   sliver - very thin triangles whose long edge grazes the origin
#include <bits/stdc++.h>
using namespace std;

typedef long long ll;

mt19937_64 rng;

ll rnd(ll lo, ll hi) { return lo + (ll)(rng() % (unsigned long long)(hi - lo + 1)); }

struct P { ll x, y; };

struct Tri { P a, b, c; };

bool ok(Tri t) {
    return (t.b.x - t.a.x) * (t.c.y - t.a.y) - (t.b.y - t.a.y) * (t.c.x - t.a.x) != 0;
}

Tri boxTri(ll R) {
    Tri t;
    do {
        t = {{rnd(-R, R), rnd(-R, R)}, {rnd(-R, R), rnd(-R, R)}, {rnd(-R, R), rnd(-R, R)}};
    } while(!ok(t));
    return t;
}

// a long thin triangle: a base edge that passes near the origin, plus a
// third corner only slightly off that line
Tri sliverTri(ll R) {
    Tri t;
    do {
        ll dx = rnd(-R, R), dy = rnd(-R, R);
        if(dx == 0 && dy == 0) dx = 1;
        ll ox = rnd(-2, 2), oy = rnd(-2, 2);           // how far the base misses the origin
        t.a = {ox - dx, oy - dy};
        t.b = {ox + dx, oy + dy};
        t.c = {ox + rnd(-3, 3), oy + rnd(-3, 3)};
    } while(!ok(t));
    return t;
}

void emit(const vector<Tri> &v) {
    printf("%d\n", (int)v.size());
    for(Tri t : v)
        printf("%lld %lld %lld %lld %lld %lld\n", t.a.x, t.a.y, t.b.x, t.b.y, t.c.x, t.c.y);
}

int main(int argc, char **argv) {

    int id = atoi(argv[1]);
    rng.seed(551903 + id);

    vector<Tri> v;

    if(id == 2) {
        // hand-made degenerates
        v.push_back({{0, 0}, {5, 0}, {0, 5}});                    // two sides along the axes
        v.push_back({{0, 0}, {-5, 0}, {0, -5}});
        v.push_back({{0, 0}, {5, 0}, {5, 5}});                    // a vertex at the origin
        v.push_back({{-4, 0}, {4, 0}, {0, 6}});                   // base lying on an axis
        v.push_back({{-4, 0}, {4, 0}, {0, -6}});
        v.push_back({{0, -4}, {0, 4}, {6, 0}});
        v.push_back({{0, -4}, {0, 4}, {-6, 0}});
        v.push_back({{1, 1}, {2, 1}, {1, 2}});                    // wholly inside one quadrant
        v.push_back({{-1, -1}, {-2, -1}, {-1, -2}});
        v.push_back({{-9, -9}, {9, -9}, {0, 9}});                 // covering all four
        v.push_back({{0, 0}, {-3, 1}, {1, -3}});                  // the statement's fourth triangle
        v.push_back({{0, 0}, {3, -1}, {-1, 3}});                  // its mirror image
        v.push_back({{0, 0}, {1, 0}, {0, 1}});                    // smallest possible, hugging the origin
        v.push_back({{2, 0}, {5, 0}, {3, 1}});                    // sitting on an axis, one side only
        v.push_back({{2, 0}, {5, 0}, {3, -1}});
        v.push_back({{0, 2}, {0, 5}, {1, 3}});
        v.push_back({{0, 2}, {0, 5}, {-1, 3}});
        v.push_back({{-1000000, -1000000}, {1000000, -1000000}, {0, 1000000}});
        v.push_back({{-1000000, 1}, {1000000, 1}, {0, 1000000}});   // only just above the x axis
        v.push_back({{-1000000, -1}, {1000000, -1}, {0, -1000000}});
        v.push_back({{1, 1000000}, {1000000, 1}, {1000000, 1000000}});
        v.push_back({{-1000000, 0}, {1000000, 0}, {0, 1000000}});   // base exactly on the x axis
        v.push_back({{0, 0}, {1000000, 1}, {1, 1000000}});
        v.push_back({{0, 0}, {-1000000, -1}, {-1, -1000000}});
    }
    else if(id == 3) {
        for(int i = 0; i < 8000; i++) v.push_back(boxTri(3));
    }
    else if(id == 4) {
        for(int i = 0; i < 6000; i++) v.push_back(boxTri(12));
        for(int i = 0; i < 2000; i++) v.push_back(boxTri(400));
    }
    else if(id == 5) {
        for(int i = 0; i < 4000; i++) v.push_back(boxTri(1000000));
        for(int i = 0; i < 2000; i++) v.push_back(sliverTri(1000000));
    }
    else {
        for(int i = 0; i < 5000; i++) v.push_back(sliverTri(30));
        for(int i = 0; i < 5000; i++) v.push_back(sliverTri(2000));
    }

    emit(v);
    return 0;
}
