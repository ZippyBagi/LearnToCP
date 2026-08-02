// gen <test_id> - prints one .in file for the segment-intersection problem to stdout.
#include <bits/stdc++.h>
using namespace std;

mt19937_64 rng;

long long rnd(long long lo, long long hi) {
    return lo + (long long)(rng() % (unsigned long long)(hi - lo + 1));
}

struct v { long long x, y; };

// a random non-zero direction with both coordinates in [-lim, lim]
v dir(long long lim) {
    v r;
    do { r.x = rnd(-lim, lim); r.y = rnd(-lim, lim); } while(r.x == 0 && r.y == 0);
    return r;
}

void emit(v a, v b, v c, v d) {
    printf("%lld %lld %lld %lld %lld %lld %lld %lld\n", a.x, a.y, b.x, b.y, c.x, c.y, d.x, d.y);
}

// a random segment inside [lo, hi]^2, endpoints guaranteed different
void randomSegment(long long lo, long long hi, v &a, v &b) {
    a.x = rnd(lo, hi); a.y = rnd(lo, hi);
    do { b.x = rnd(lo, hi); b.y = rnd(lo, hi); } while(a.x == b.x && a.y == b.y);
}

int main(int argc, char **argv) {

    int id = atoi(argv[1]);
    rng.seed(551903 + id);

    if(id == 2) {
        // small coordinate range - endpoints land on each other by accident all the time
        int t = 10000;
        printf("%d\n", t);
        for(int i = 0; i < t; i++) {
            v a, b, c, d;
            randomSegment(-20, 20, a, b);
            randomSegment(-20, 20, c, d);
            emit(a, b, c, d);
        }
    }
    else if(id == 3) {
        // extreme coordinates - the cross products overflow int here
        int t = 5000;
        printf("%d\n", t);
        for(int i = 0; i < t; i++) {
            v a, b, c, d;
            randomSegment(-1000000000LL, 1000000000LL, a, b);
            randomSegment(-1000000000LL, 1000000000LL, c, d);
            emit(a, b, c, d);
        }
    }
    else if(id == 4) {
        // one of five hand-designed shapes per line, all of them degenerate in some way
        int t = 2000;
        printf("%d\n", t);
        for(int i = 0; i < t; i++) {

            v p = {rnd(-1000000, 1000000), rnd(-1000000, 1000000)};
            v u = dir(100);
            v w = dir(100);
            v perp = {-u.y, u.x};
            int kind = i % 5;

            v a, b, c, d;

            if(kind == 0) {        // collinear and overlapping
                a = p;
                b = {p.x + 3 * u.x, p.y + 3 * u.y};
                c = {p.x + 2 * u.x, p.y + 2 * u.y};
                d = {p.x + 5 * u.x, p.y + 5 * u.y};
            }
            else if(kind == 1) {   // collinear but disjoint
                a = p;
                b = {p.x + 2 * u.x, p.y + 2 * u.y};
                c = {p.x + 4 * u.x, p.y + 4 * u.y};
                d = {p.x + 6 * u.x, p.y + 6 * u.y};
            }
            else if(kind == 2) {   // sharing exactly one endpoint
                a = p;
                b = {p.x + 3 * u.x, p.y + 3 * u.y};
                c = p;
                d = {p.x + 3 * w.x, p.y + 3 * w.y};
            }
            else if(kind == 3) {   // an endpoint of cd landing in the middle of ab
                a = p;
                b = {p.x + 4 * u.x, p.y + 4 * u.y};
                c = {p.x + 2 * u.x, p.y + 2 * u.y};
                d = {p.x + 2 * u.x + 3 * w.x, p.y + 2 * u.y + 3 * w.y};
            }
            else {                 // parallel, on different lines
                a = p;
                b = {p.x + 3 * u.x, p.y + 3 * u.y};
                c = {p.x + perp.x, p.y + perp.y};
                d = {p.x + 3 * u.x + perp.x, p.y + 3 * u.y + perp.y};
            }

            emit(a, b, c, d);
        }
    }
    else if(id == 5) {
        // a 7x7 world - almost every line is some kind of touching or overlap
        int t = 1000;
        printf("%d\n", t);
        for(int i = 0; i < t; i++) {
            v a, b, c, d;
            randomSegment(-3, 3, a, b);
            randomSegment(-3, 3, c, d);
            emit(a, b, c, d);
        }
    }
    else {
        // half of the lines are built around a shared point, half are far apart
        int t = 5000;
        printf("%d\n", t);
        for(int i = 0; i < t; i++) {
            if(i % 2 == 0) {
                v o = {rnd(-1000000, 1000000), rnd(-1000000, 1000000)};
                v u = dir(1000), w = dir(1000);
                long long k1 = rnd(0, 50), k2 = rnd(0, 50), k3 = rnd(0, 50), k4 = rnd(0, 50);
                if(k1 == 0 && k2 == 0) k2 = 1;
                if(k3 == 0 && k4 == 0) k4 = 1;
                v a = {o.x - k1 * u.x, o.y - k1 * u.y};
                v b = {o.x + k2 * u.x, o.y + k2 * u.y};
                v c = {o.x - k3 * w.x, o.y - k3 * w.y};
                v d = {o.x + k4 * w.x, o.y + k4 * w.y};
                emit(a, b, c, d);
            } else {
                v a, b, c, d;
                randomSegment(0, 100, a, b);
                randomSegment(100000000LL, 100000100LL, c, d);
                emit(a, b, c, d);
            }
        }
    }

    return 0;
}
