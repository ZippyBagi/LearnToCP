// gen <test_id> - prints one .in file for the plate-apart problem to stdout.
//
// Every cut has to be a simple polyline from the bottom edge to the top edge,
// which is the only awkward part of generating this problem. The trick used
// here is to slice the plate into horizontal strips and let the cut cross each
// strip with an x-monotone path: an x-monotone path cannot touch itself, and
// two strips only ever share the single junction point, so the whole cut is
// simple by construction while y is still free to go up and down inside a strip.
//
//   strips all leaning the same way  -> every direction sits in one half of the
//                                       circle, so the answer is YES even though
//                                       the cut is not monotone in y
//   strips leaning left and right    -> the directions spread all the way round
//                                       and the answer is NO
#include <bits/stdc++.h>
using namespace std;

typedef long long ll;

mt19937_64 rng;

ll rnd(ll lo, ll hi) { return lo + (ll)(rng() % (unsigned long long)(hi - lo + 1)); }

struct P { ll x, y; };

struct Case { ll w, h; vector<P> p; };

// One cut across a plate w x h, built strip by strip.
//   strips     - how many strips the height is cut into
//   perStrip   - segments used to cross one strip
//   alternate  - if true the strips lean left and right in turn
//   allowDown  - if true the path may dip inside a strip
Case stripCut(ll w, ll h, int strips, int perStrip, bool alternate, bool allowDown) {

    // room check: every strip needs at least one row of height and every segment
    // needs its own x, otherwise the path could stall and touch itself
    if(strips > h / 3) strips = (int)(h / 3);         // every strip needs room to dip
    if(strips < 1) strips = 1;

    ll lo = 1, hi = w - 1;
    if(hi - lo < perStrip) perStrip = (int)max(1LL, hi - lo);

    if(!alternate) {
        ll room = (hi - lo) / strips;                 // one private x band per strip
        if(room < perStrip) perStrip = (int)max(1LL, room);
    }

    Case c;
    c.w = w; c.h = h;

    ll x = alternate ? lo : lo, y = 0;
    c.p.push_back({x, y});

    for(int k = 0; k < strips; k++) {

        ll bot = y;
        ll top = h * (k + 1) / strips;
        if(k == strips - 1) top = h;
        if(top <= bot) continue;

        // where this strip has to end up horizontally
        ll target;
        if(alternate) target = (k % 2 == 0) ? hi : lo;
        else          target = lo + (hi - lo) * (k + 1) / strips;

        for(int i = 1; i <= perStrip; i++) {

            ll nx = x + (target - x) * i / perStrip;
            if(i == perStrip) nx = target;

            ll ny;
            if(i == perStrip)       ny = top;                     // land on the junction
            else if(allowDown)      ny = rnd(bot + 1, max(bot + 1, top - 1));
            else                    ny = bot + (top - bot) * i / (perStrip + 1);

            if(ny <= bot && ny <= 0) ny = 1;
            if(nx == c.p.back().x && ny == c.p.back().y) continue; // never repeat a point

            c.p.push_back({nx, ny});
        }

        x = c.p.back().x;
        y = c.p.back().y;
    }

    if(c.p.back().y != h) c.p.push_back({c.p.back().x, h});
    return c;
}

void emit(const vector<Case> &v) {
    printf("%d\n", (int)v.size());
    for(const Case &c : v) {
        printf("%lld %lld %d\n", c.w, c.h, (int)c.p.size());
        for(P a : c.p) printf("%lld %lld\n", a.x, a.y);
    }
}

Case handmade(ll w, ll h, vector<P> pts) { return {w, h, pts}; }

int main(int argc, char **argv) {

    int id = atoi(argv[1]);
    rng.seed(661307 + id);

    vector<Case> v;

    if(id == 2) {
        // the smallest possible cut, straight up
        v.push_back(handmade(5, 5, {{2, 0}, {2, 5}}));
        // a straight slanted cut
        v.push_back(handmade(6, 4, {{1, 0}, {5, 4}}));
        // a straight cut split into two collinear pieces of different lengths: (2,3)
        // and (4,6) are one direction only after the gcd, and a solution that skips
        // the gcd sees two directions, misses the m == 1 case and answers NO
        v.push_back(handmade(9, 9, {{1, 0}, {3, 3}, {7, 9}}));
        // two horizontal edges and a vertical one: the gap is exactly half a circle
        v.push_back(handmade(6, 6, {{2, 0}, {2, 2}, {4, 2}, {4, 4}, {2, 4}, {2, 6}}));
        // the same shape mirrored
        v.push_back(handmade(6, 6, {{4, 0}, {4, 2}, {2, 2}, {2, 4}, {4, 4}, {4, 6}}));
        // the two statement cuts again
        v.push_back(handmade(5, 5, {{3, 0}, {2, 2}, {3, 1}, {3, 4}, {2, 3}, {3, 5}}));
        v.push_back(handmade(5, 5, {{3, 0}, {2, 1}, {3, 2}, {2, 3}, {3, 4}, {2, 5}}));
        // a single overhang: up, right and down, up, left and down
        v.push_back(handmade(9, 12, {{3, 0}, {3, 6}, {5, 5}, {5, 11}, {3, 10}, {3, 12}}));
        // wanders down but keeps leaning the same way, so it still comes apart
        v.push_back(handmade(20, 8, {{2, 0}, {6, 3}, {9, 1}, {13, 6}, {16, 4}, {18, 8}}));
        // the whole plate at the coordinate limit
        v.push_back(handmade(1000000, 1000000, {{500000, 0}, {1, 999999}, {999999, 1}, {500000, 1000000}}));
    }
    else if(id == 3) {
        for(int i = 0; i < 5; i++)
            v.push_back(stripCut(2000, 2000, (int)rnd(2, 12), (int)rnd(2, 6), false, true));
        for(int i = 0; i < 5; i++)
            v.push_back(stripCut(2000, 2000, (int)rnd(2, 12), (int)rnd(2, 6), true, true));
    }
    else if(id == 4) {
        // one long cut that leans one way throughout - a big YES
        v.push_back(stripCut(60000, 60000, 3000, 8, false, true));
    }
    else if(id == 5) {
        // one long cut that leans both ways - a big NO
        v.push_back(stripCut(60000, 60000, 3000, 8, true, true));
    }
    else {
        // coordinates at the limit, so the cross products overflow int
        for(int i = 0; i < 4; i++)
            v.push_back(stripCut(1000000, 1000000, (int)rnd(3, 60), (int)rnd(4, 8), true, true));
        for(int i = 0; i < 3; i++)
            v.push_back(stripCut(1000000, 1000000, (int)rnd(3, 60), (int)rnd(4, 8), false, true));
        for(int i = 0; i < 3; i++)
            v.push_back(stripCut(1000000, 1000000, (int)rnd(2, 60), (int)rnd(2, 8), false, false));
    }

    emit(v);
    return 0;
}
