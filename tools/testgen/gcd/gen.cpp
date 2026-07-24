#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(2600+id);
    if(id==2){
        printf("1000\n");
        for(int i=0;i<1000;i++) printf("%lld %lld %lld\n",rnd(1,50),rnd(1,50),rnd(1,50));
    } else if(id==3){
        printf("1000\n");
        for(int i=0;i<1000;i++){
            long long g=rnd(1,1000);
            printf("%lld %lld %lld\n",g*rnd(1,1000),g*rnd(1,1000),g*rnd(1,1000)); // built around a common divisor
        }
    } else if(id==4){
        // edges: all equal, ones, coprime, maximum values (> int)
        printf("5\n1 1 1\n2000000000 2000000000 2000000000\n1999999973 1999999943 2\n1 2000000000 1999999999\n1536000000 1920000000 1024000000\n");
    } else if(id==5){
        printf("1000\n");
        for(int i=0;i<1000;i++){
            long long g=rnd(1,100000);
            printf("%lld %lld %lld\n",g*rnd(1,2000000000/g),g*rnd(1,2000000000/g),g*rnd(1,2000000000/g));
        }
    }
    return 0;
}
