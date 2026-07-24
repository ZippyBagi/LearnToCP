#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(3300+id);
    if(id==2){
        printf("1000\n");
        for(int i=0;i<1000;i++) printf("%lld %lld %lld\n",rnd(1,20),rnd(1,10),rnd(1,4)); // small enough for the brute
    } else if(id==3){
        printf("1000\n");
        for(int i=0;i<1000;i++) printf("%lld %lld %lld\n",rnd(1,1000000000LL),rnd(1,1000),rnd(1,9));
    } else if(id==4){
        // edges: a = 1, n = 1, powers of 10, k = 9, huge exponents
        printf("7\n1 1000000000 9\n1000000000 1 9\n10 9 9\n10 1000000000 9\n999999999 1000000000 9\n2 1000000000 1\n123456789 987654321 5\n");
    } else if(id==5){
        printf("30000\n");
        for(int i=0;i<30000;i++) printf("%lld %lld %lld\n",rnd(1,1000000000LL),rnd(1,1000000000LL),rnd(1,9));
    }
    return 0;
}
