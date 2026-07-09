// Usage: gen <test_id>
#include <bits/stdc++.h>
using namespace std;
int main(int argc, char** argv){
    int t = atoi(argv[1]);
    mt19937_64 rng(181920 + t);
    if(t == 2){ printf("1 1\n1 1000000\n"); return 0; } // minimal edge case
    int n, W;
    if(t == 3){ n = 12; W = 50; }        // small (brute-force verifiable)
    else if(t == 4){ n = 100; W = 10000; } // max constraints, light items
    else { n = 100; W = 10000; }         // max constraints, heavy items
    printf("%d %d\n", n, W);
    for(int i = 0; i < n; i++){
        long long w;
        if(t == 5) w = W/3 + rng() % (W - W/3 + 1);  // heavy: only ~2 fit
        else w = 1 + rng() % (t == 3 ? 25 : 500);
        long long v = 1 + rng() % 1000000;
        printf("%lld %lld\n", w, v);
    }
}
