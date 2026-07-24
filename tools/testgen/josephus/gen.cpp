#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(2900+id);
    if(id==2){
        // many tiny games, sum n = 3 * 100 = well within limits
        printf("100\n");
        for(int i=0;i<100;i++){long long n=rnd(2,10);printf("%lld %lld\n",n,rnd(2,n));}
    } else if(id==3){
        printf("20\n");
        long long left=2000;
        for(int i=0;i<20;i++){long long n=rnd(2,100);left-=n;printf("%lld %lld\n",n,rnd(2,n));}
    } else if(id==4){
        // edges: smallest game, m = 2, m = n
        printf("4\n2 2\n3 3\n2500 2\n2400 2400\n");
    } else if(id==5){
        // worst case: one big game with big m
        printf("1\n5000 5000\n");
    }
    return 0;
}
