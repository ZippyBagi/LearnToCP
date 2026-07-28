#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}
void emitCase(int n,long long hi){
    printf("%d\n",n);
    for(int i=0;i<n;i++) printf("%lld%c",rnd(1,hi),i+1<n?' ':'\n');
}
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(4300+id);
    if(id==2){
        // tiny arrays with tiny values - cheap to cross-check against the brute force
        printf("10\n");
        for(int i=0;i<10;i++) emitCase(rnd(1,8),15);
    } else if(id==3){
        printf("10\n");
        for(int i=0;i<10;i++) emitCase(rnd(1,2000),1000000000LL);
    } else if(id==4){
        // edges: single element, all equal, one number per highest-bit class,
        // and the two extremes of the value range
        printf("5\n");
        printf("1\n7\n");
        printf("6\n5 5 5 5 5 5\n");
        printf("30\n");
        for(int k=0;k<30;k++) printf("%lld%c",1LL<<k,k+1<30?' ':'\n');
        printf("2\n1 1000000000\n");
        printf("4\n1 1 1000000000 999999999\n");
    } else if(id==5){
        // max n, 3-digit values: complexity depends on n, not on how long the numbers are
        printf("1\n");
        emitCase(100000,999);
    } else if(id==6){
        // every number is in [512, 1023], so they all share the highest bit and the answer is
        // C(100000, 2) = 4999950000 - well past what an int can hold
        int n=100000;
        printf("1\n%d\n",n);
        for(int i=0;i<n;i++) printf("%lld%c",rnd(512,1023),i+1<n?' ':'\n');
    }
    return 0;
}
