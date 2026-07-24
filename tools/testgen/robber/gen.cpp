// Usage: gen <test_id>
#include <bits/stdc++.h>
using namespace std;
int main(int argc, char** argv){
    int t = atoi(argv[1]);
    mt19937_64 rng(5678 + t);
    if(t == 2){ printf("1\n42\n"); return 0; }       // single house edge case
    int n; long long lo = 0, hi;
    bool allmax = false;
    if(t == 3){ n = 10; hi = 20; }                   // small, with zeros
    else if(t == 4){ n = 200000; hi = 999; }         // max n; small values keep the file small
    else { n = 5000; allmax = true; hi = 1000000000LL; } // overflow check: 2500 * 10^9 > INT_MAX
    printf("%d\n", n);
    for(int i = 0; i < n; i++){
        long long v = allmax ? hi : lo + (long long)(rng() % (hi - lo + 1));
        printf("%lld%c", v, i+1 < n ? ' ' : '\n');
    }
}
