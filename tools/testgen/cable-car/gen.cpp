// gen <test_id> - prints one .in file for the cable-car problem to stdout.
//
// Every testcase is a set of distinct collinear lattice points. A line is built
// from a primitive direction (dx, dy) with gcd(|dx|, |dy|) = 1, then distinct
// multiples of that direction are picked and shuffled. The first two printed
// pylons decide the travel direction, so the shuffle is what makes the answer
// non-trivial.
//
// Test sizes follow the "keep test files small" rule: the big test that kills
// O(n^2) uses small coordinates, and the coordinates at the limit live in their
// own small test.
#include <bits/stdc++.h>
using namespace std;

typedef long long ll;

mt19937_64 rng;

ll rnd(ll lo, ll hi) { return lo + (ll)(rng() % (unsigned long long)(hi - lo + 1)); }

struct P { ll x, y; };

// up to n distinct collinear points, every coordinate inside [-lim, lim]
vector<P> line_case(int n, ll lim, ll dx, ll dy) {

    ll g = __gcd(llabs(dx), llabs(dy));
    if(g == 0) { dx = 1; dy = 0; g = 1; }
    dx /= g; dy /= g;

    // the largest multiple of (dx, dy) that still fits in the box
    ll stepMax = lim;
    if(dx != 0) stepMax = min(stepMax, lim / llabs(dx));
    if(dy != 0) stepMax = min(stepMax, lim / llabs(dy));

    if(n > 2 * stepMax + 1) n = (int)(2 * stepMax + 1);   // never leave the box
    if(n < 3) n = 3;

    set<ll> ks;
    while((int)ks.size() < n) ks.insert(rnd(-stepMax, stepMax));

    vector<ll> k(ks.begin(), ks.end());
    shuffle(k.begin(), k.end(), rng);

    vector<P> p;
    for(int i = 0; i < n; i++) p.push_back({k[i] * dx, k[i] * dy});
    return p;
}

void emit(const vector<vector<P>> &cases) {
    printf("%d\n", (int)cases.size());
    for(const vector<P> &p : cases) {
        printf("%d\n", (int)p.size());
        for(P a : p) printf("%lld %lld\n", a.x, a.y);
    }
}

int main(int argc, char **argv) {

    int id = atoi(argv[1]);
    rng.seed(390211 + id);

    vector<vector<P>> cases;

    if(id == 2) {
        // hand-made degenerates: the smallest input, vertical and horizontal lines,
        // both travel directions, and the coordinate limit
        cases.push_back({{0, 0}, {0, 1}, {0, -1}});                       // vertical, upwards
        cases.push_back({{0, 1}, {0, 0}, {0, -1}});                       // vertical, downwards
        cases.push_back({{-5, 3}, {7, 3}, {0, 3}, {100, 3}});             // horizontal, right
        cases.push_back({{7, 3}, {-5, 3}, {0, 3}, {100, 3}});             // horizontal, left
        cases.push_back({{-1000000, -1000000}, {1000000, 1000000}, {0, 0}});
        cases.push_back({{1000000, -1000000}, {-1000000, 1000000}, {0, 0}});
        cases.push_back({{-1000000, 999999}, {1000000, 999999}, {3, 999999}, {-7, 999999}});
        cases.push_back({{2, 4}, {5, 10}, {-4, -8}, {8, 16}, {-1, -2}});  // slope 2, forwards
        cases.push_back({{5, 10}, {2, 4}, {-4, -8}, {8, 16}, {-1, -2}});  // same points, backwards
        cases.push_back({{999999, 1}, {-999999, -1}, {0, 0}});            // very steep, three points
    }
    else if(id == 3) {
        // ten medium lines with assorted directions
        for(int i = 0; i < 10; i++) {
            ll dx = rnd(-40, 40), dy = rnd(-40, 40);
            if(dx == 0 && dy == 0) dx = 1;
            cases.push_back(line_case((int)rnd(3, 400), 1000000, dx, dy));
        }
    }
    else if(id == 4) {
        // one big line with small coordinates - this is the test that kills O(n^2)
        cases.push_back(line_case(30000, 35000, 1, 1));
    }
    else if(id == 5) {
        // coordinates at the limit, so every dot product overflows int
        cases.push_back(line_case(3000, 1000000, 1, 1));
        cases.push_back(line_case(3000, 1000000, -1, 1));
        cases.push_back(line_case(3000, 1000000, 0, 1));
        cases.push_back(line_case(3000, 1000000, 1, 0));
    }
    else {
        // ten lines of assorted sizes, three of them axis parallel
        int budget = 20000;
        for(int i = 0; i < 10; i++) {
            int n = (i == 9) ? budget : (int)rnd(3, max(4, budget / 3));
            budget -= n;
            ll dx = (i % 3 == 0) ? 0 : rnd(-9, 9);
            ll dy = (i % 3 == 1) ? 0 : rnd(-9, 9);
            if(dx == 0 && dy == 0) dy = 1;
            cases.push_back(line_case(max(n, 3), 30000, dx, dy));
        }
    }

    emit(cases);
    return 0;
}
