// Usage: gen <test_id>
#include <bits/stdc++.h>
using namespace std;
int main(int argc, char** argv){
    int t = atoi(argv[1]);
    mt19937_64 rng(151617 + t);
    if(t == 2){ printf("1\n1000000000\n"); return 0; } // single element
    int n = 100000; long long hi = 1000000000LL;
    printf("%d\n", n);
    for(int i = 0; i < n; i++){
        long long v;
        if(t == 3) v = i + 1;                          // strictly increasing, answer n
        else if(t == 4) v = 1 + (long long)(rng() % 100); // tiny range, lots of equal values
        else if(t == 6) v = n - i;                     // strictly decreasing, answer 1
        else v = 1 + (long long)(rng() % hi);          // random
        printf("%lld%c", v, i+1 < n ? ' ' : '\n');
    }
}
