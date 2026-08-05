// brute.cpp - independent reference for the cable-car problem.
//
// Instead of projecting with a dot product, this one writes every pylon as
//   P = P0 + s * d,   d = P1 - P0
// and compares the parameters s as exact rationals in __int128. The parameter
// is read off whichever coordinate of d is non-zero, so no projection, no
// square root and no floating point is involved anywhere.
//
// It also runs a full O(n^2) insertion sort, so it is slow on purpose.
#include <bits/stdc++.h>
using namespace std;

typedef long long ll;
typedef __int128 lll;

struct P { ll x, y; };

int main() {

    int t;
    if(scanf("%d", &t) != 1) return 0;

    while(t--) {

        int n;
        scanf("%d", &n);

        vector<P> p(n);
        for(int i = 0; i < n; i++) scanf("%lld %lld", &p[i].x, &p[i].y);

        ll dx = p[1].x - p[0].x, dy = p[1].y - p[0].y;

        // s = num / den, den > 0 for every pylon
        vector<lll> num(n), den(n);

        for(int i = 0; i < n; i++) {
            if(dx != 0) { num[i] = p[i].x - p[0].x; den[i] = dx; }
            else        { num[i] = p[i].y - p[0].y; den[i] = dy; }
            if(den[i] < 0) { den[i] = -den[i]; num[i] = -num[i]; }
        }

        vector<int> ord(n);
        for(int i = 0; i < n; i++) ord[i] = i;

        // insertion sort, comparing a/b < c/d as a*d < c*b (all denominators positive)
        for(int i = 1; i < n; i++) {
            int j = i;
            while(j > 0) {
                int a = ord[j - 1], b = ord[j];
                if(num[b] * den[a] < num[a] * den[b]) { swap(ord[j - 1], ord[j]); j--; }
                else break;
            }
        }

        for(int i = 0; i < n; i++) printf("%lld %lld\n", p[ord[i]].x, p[ord[i]].y);
    }

    return 0;
}
