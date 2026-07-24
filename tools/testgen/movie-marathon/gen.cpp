// Usage: gen <test_id>
#include <bits/stdc++.h>
using namespace std;
int main(int argc, char** argv){
    int t = atoi(argv[1]);
    mt19937_64 rng(9100 + t);
    auto rnd = [&](long long lo, long long hi){ return lo + (long long)(rng() % (hi - lo + 1)); };

    if(t == 2){ printf("1\n0 1000000000\n"); return 0; }   // single movie, extreme times

    if(t == 3){                                            // small, tie-heavy: duplicates + touching intervals
        int n = 12;
        printf("%d\n", n);
        for(int i = 0; i < n; i++){
            long long a = rnd(0, 15);
            long long b = a + rnd(1, 5);
            printf("%lld %lld\n", a, b);
        }
        return 0;
    }

    if(t == 4){                                            // nested traps: giant intervals covering many short ones
        int n = 1000;
        printf("%d\n", n);
        for(int i = 0; i < n; i++){
            if(i % 10 == 0){                               // every 10th movie spans almost everything
                printf("%lld %lld\n", rnd(0, 100), rnd(900000000, 1000000000));
            }else{
                long long a = rnd(0, 999999000);
                printf("%lld %lld\n", a, a + rnd(1, 1000));
            }
        }
        return 0;
    }

    if(t == 5){                                            // big n, random; 6-digit times keep the file small
        int n = 70000;
        printf("%d\n", n);
        for(int i = 0; i < n; i++){
            long long a = rnd(0, 999998);
            long long b = rnd(a + 1, 999999);
            printf("%lld %lld\n", a, b);
        }
        return 0;
    }

    // t == 6: big n, back-to-back chain (answer = n, heavy on the >= condition)
    int n = 70000;
    printf("%d\n", n);
    long long cur = 0;
    for(int i = 0; i < n; i++){
        long long len = rnd(1, 9);
        printf("%lld %lld\n", cur, cur + len);
        cur += len;
    }
    return 0;
}
