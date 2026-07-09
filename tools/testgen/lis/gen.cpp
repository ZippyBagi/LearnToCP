// Usage: gen <test_id>
#include <bits/stdc++.h>
using namespace std;
int main(int argc, char** argv){
    int t = atoi(argv[1]);
    mt19937_64 rng(121314 + t);
    if(t == 2){ printf("1\n7\n"); return 0; }   // single element
    int n; long long hi;
    bool decreasing = false;
    if(t == 3){ n = 100; decreasing = true; hi = 0; } // strictly decreasing, k = 1
    else if(t == 4){ n = 1000; hi = 50; }             // many duplicates, lex tie-breaks matter
    else { n = 1000; hi = 1000000000LL; }             // max size random
    printf("%d\n", n);
    for(int i = 0; i < n; i++){
        long long v = decreasing ? (long long)(n - i) * 3 : 1 + (long long)(rng() % hi);
        printf("%lld%c", v, i+1 < n ? ' ' : '\n');
    }
}
