#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(4100+id);
    if(id==2){
        // many tiny cases - cheap to cross-check against the brute force
        printf("1000\n");
        for(int i=0;i<1000;i++) printf("%lld %lld\n",rnd(1,1000),rnd(1,1000));
    } else if(id==3){
        printf("1000\n");
        for(int i=0;i<1000;i++) printf("%lld %lld\n",rnd(1,1000000000LL),rnd(1,1000000000LL));
    } else if(id==4){
        // edges: equal numbers (answer 0), the extremes, and the pair with the largest
        // possible answer 2^30 - 1 = 1073741823 (still an int, but far past 10^9)
        printf("10\n");
        printf("1 1\n");
        printf("1 2\n");
        printf("2 1\n");
        printf("1000000000 1000000000\n");
        printf("1 1000000000\n");
        printf("1000000000 1\n");
        printf("536870912 536870911\n");
        printf("536870911 536870912\n");
        printf("999999999 1000000000\n");
        printf("1000000000 999999999\n");
    } else if(id==5){
        // values crowded just under the limit - answers stay large
        printf("1000\n");
        for(int i=0;i<1000;i++) printf("%lld %lld\n",rnd(999000000LL,1000000000LL),rnd(536870912LL,1000000000LL));
    }
    return 0;
}
