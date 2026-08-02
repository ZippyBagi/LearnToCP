// gen <test_id> - prints one .in file for the two-banks problem to stdout.
#include <bits/stdc++.h>
using namespace std;

mt19937_64 rng;

long long rnd(long long lo, long long hi) {
    return lo + (long long)(rng() % (unsigned long long)(hi - lo + 1));
}

int main(int argc, char **argv) {

    int id = atoi(argv[1]);
    rng.seed(940217 + id);

    if(id == 2) {
        // max n, small coordinates - plenty of collisions on the line
        int n = 100000;
        printf("1\n%d\n", n);
        printf("-500 -500 500 500\n");
        for(int i = 0; i < n; i++) printf("%lld %lld\n", rnd(-999, 999), rnd(-999, 999));
    }
    else if(id == 3) {
        // extreme coordinates, small n - the cross product overflows int here
        int t = 10;
        printf("%d\n", t);
        for(int i = 0; i < t; i++) {
            int n = 20;
            printf("%d\n", n);
            long long ax = rnd(-1000000000LL, 1000000000LL), ay = rnd(-1000000000LL, 1000000000LL);
            long long bx, by;
            do { bx = rnd(-1000000000LL, 1000000000LL); by = rnd(-1000000000LL, 1000000000LL); }
            while(ax == bx && ay == by);
            printf("%lld %lld %lld %lld\n", ax, ay, bx, by);
            for(int j = 0; j < n; j++)
                printf("%lld %lld\n", rnd(-1000000000LL, 1000000000LL), rnd(-1000000000LL, 1000000000LL));
        }
    }
    else if(id == 4) {
        // every single house sits on the river
        int n = 1000;
        printf("1\n%d\n", n);
        printf("0 0 3 7\n");
        for(int i = 0; i < n; i++) {
            long long k = rnd(-100000, 100000);
            printf("%lld %lld\n", 3 * k, 7 * k);
        }
    }
    else if(id == 5) {
        // tiny testcases, horizontal / vertical / reversed rivers
        int t = 10;
        printf("%d\n", t);
        for(int i = 0; i < t; i++) {
            int n = (int)rnd(1, 3);
            printf("%d\n", n);
            long long ax = rnd(-5, 5), ay = rnd(-5, 5), bx = ax, by = ay;
            int kind = i % 3;
            if(kind == 0) bx = ax + rnd(1, 5);              // horizontal
            else if(kind == 1) by = ay + rnd(1, 5);         // vertical
            else { bx = ax - rnd(1, 5); by = ay - rnd(1, 5); } // pointing down-left
            printf("%lld %lld %lld %lld\n", ax, ay, bx, by);
            for(int j = 0; j < n; j++) printf("%lld %lld\n", rnd(-5, 5), rnd(-5, 5));
        }
    }
    else {
        // half the houses forced onto the river, half random
        int n = 50000;
        printf("1\n%d\n", n);
        printf("-1000000000 -1000000000 1000000000 1000000000\n");
        for(int i = 0; i < n; i++) {
            if(i % 2 == 0) { long long k = rnd(-1000000000LL, 1000000000LL); printf("%lld %lld\n", k, k); }
            else printf("%lld %lld\n", rnd(-999, 999), rnd(-999, 999));
        }
    }

    return 0;
}
