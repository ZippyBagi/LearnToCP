// gen <test_id> - prints one .in file for the morse-sequence problem to stdout.
//
// Families:
//   02 - every position in the first few blocks, so the whole small prefix is
//        pinned down exactly (also cheap to cross-check against brute.cpp)
//   03 - random positions inside the brute-forceable range
//   04 - powers of two and their neighbours, where the block boundaries are
//   05 - random positions across the full 10^18 range
//   06 - max t, positions crowded just under 10^18
#include <bits/stdc++.h>

using namespace std;

typedef unsigned long long ull;

mt19937_64 rng;

ull rnd(ull lo, ull hi) { return lo + rng() % (hi - lo + 1); }

int main(int argc, char **argv) {
    int id = atoi(argv[1]);
    rng.seed(9110 + id);

    const ull MAXN = 1000000000000000000ULL;

    vector<ull> v;

    if (id == 2) {
        for (ull n = 1; n <= 1024; n++) v.push_back(n);
    } else if (id == 3) {
        for (int i = 0; i < 10000; i++) v.push_back(rnd(1, 4000000));
    } else if (id == 4) {
        for (int k = 0; k < 60; k++) {
            ull p = 1ULL << k;
            if (p - 1 >= 1) v.push_back(p - 1);
            v.push_back(p);
            if (p + 1 <= MAXN) v.push_back(p + 1);
        }
        v.push_back(1);
        v.push_back(MAXN);
        v.push_back(MAXN - 1);
    } else if (id == 5) {
        for (int i = 0; i < 10000; i++) v.push_back(rnd(1, MAXN));
    } else {
        for (int i = 0; i < 10000; i++) v.push_back(rnd(MAXN - 1000000, MAXN));
    }

    printf("%zu\n", v.size());
    for (ull n : v) printf("%llu\n", n);
    return 0;
}
