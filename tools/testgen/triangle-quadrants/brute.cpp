// brute.cpp - independent reference for the triangle-quadrants problem.
//
// Completely different argument from solution.cpp. If the triangle covers a piece of
// an open quadrant, then walking from that piece in the quadrant's own direction
// (sx, sy) never leaves the quadrant and must eventually leave the
// triangle, so its boundary reaches the open quadrant too. So it is enough to ask:
//
//   * is some vertex strictly inside the quadrant, or
//   * does some open side of the triangle pass through the quadrant?
//
// The second question is a one dimensional one: the side is A + t*(B - A) for
// t in (0, 1), each of the two conditions sx*x > 0 and sy*y > 0 cuts that
// interval down, and the answer is whether anything is left. All the endpoints
// are fractions and every comparison is done by cross multiplication, so this
// is exact.
#include <bits/stdc++.h>
using namespace std;

typedef long long ll;

struct P { ll x, y; };

// an open interval (lo, hi) of the parameter t, each bound stored as n / d with d > 0
struct Range {
    ll ln, ld, hn, hd;
    bool empty;
};

void tighten(Range &r, ll u, ll w) {

    // condition u + t*w > 0
    if(r.empty) return;

    if(w == 0) { if(u <= 0) r.empty = true; return; }

    // the bound is t = -u / w
    ll bn = -u, bd = w;
    if(bd < 0) { bd = -bd; bn = -bn; }

    if(w > 0) {                                   // t > bn / bd
        if((__int128)bn * r.ld > (__int128)r.ln * bd) { r.ln = bn; r.ld = bd; }
    } else {                                      // t < bn / bd
        if((__int128)bn * r.hd < (__int128)r.hn * bd) { r.hn = bn; r.hd = bd; }
    }

    if((__int128)r.ln * r.hd >= (__int128)r.hn * r.ld) r.empty = true;
}

bool edgeMeets(P a, P b, ll sx, ll sy) {

    Range r = {0, 1, 1, 1, false};                 // t in (0, 1)

    tighten(r, sx * a.x, sx * (b.x - a.x));
    tighten(r, sy * a.y, sy * (b.y - a.y));

    return !r.empty;
}

bool reaches(P p[3], ll sx, ll sy) {

    for(int i = 0; i < 3; i++)
        if(sx * p[i].x > 0 && sy * p[i].y > 0) return true;

    for(int i = 0; i < 3; i++)
        if(edgeMeets(p[i], p[(i + 1) % 3], sx, sy)) return true;

    return false;
}

int main() {

    int t;
    if(scanf("%d", &t) != 1) return 0;

    while(t--) {

        P p[3];
        for(int i = 0; i < 3; i++) {
            if(scanf("%lld %lld", &p[i].x, &p[i].y) != 2) return 0;
        }

        printf("%c%c%c%c\n",
               reaches(p,  1,  1) ? '+' : '-',
               reaches(p, -1,  1) ? '+' : '-',
               reaches(p, -1, -1) ? '+' : '-',
               reaches(p,  1, -1) ? '+' : '-');
    }

    return 0;
}
