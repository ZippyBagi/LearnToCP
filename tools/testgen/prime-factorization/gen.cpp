#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(2500+id);
    if(id==2){
        printf("100\n");
        for(int i=0;i<100;i++) printf("%lld\n",rnd(2,1000));
    } else if(id==3){
        printf("100\n");
        for(int i=0;i<100;i++) printf("%lld\n",rnd(2,1000000));
    } else if(id==4){
        // edges: 2, big prime > int, power of two, prime squared, 2 * big prime
        printf("7\n2\n1999999973\n1073741824\n999002449\n1999999966\n2000000000\n1999999999\n");
    } else if(id==5){
        printf("100\n");
        for(int i=0;i<100;i++) printf("%lld\n",rnd(1000000000,2000000000)); // big random, > int range often
    } else if(id==6){
        // worst case: many large primes (loop runs to sqrt every time)
        long long primes[6]={1999999973,1999999943,1999999927,1999999913,1999999891,1999999859};
        printf("100\n");
        for(int i=0;i<100;i++) printf("%lld\n",primes[rnd(0,5)]);
    }
    return 0;
}
