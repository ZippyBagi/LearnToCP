#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(2400+id);
    if(id==2){
        printf("1000\n");
        for(int i=0;i<1000;i++) printf("%lld\n",rnd(1,100));           // tiny numbers, includes 1 and 2
    } else if(id==3){
        printf("1000\n");
        for(int i=0;i<1000;i++) printf("%lld\n",rnd(1,1000000));
    } else if(id==4){
        // edge cases: 1, 2, 3, 4, primes and squares of primes near the limit
        printf("10\n1\n2\n3\n4\n999999937\n999999936\n999999999\n999002449\n961748941\n982451653\n"); // 999002449 = 31607^2
    } else if(id==5){
        printf("1000\n");
        for(int i=0;i<1000;i++) printf("%lld\n",rnd(900000000,1000000000)); // big random
    } else if(id==6){
        // worst case for the loop: many large primes (slowest to reject)
        long long primes[10]={999999937,999999893,999999883,999999797,999999761,999999757,999999751,999999739,999999733,999999677};
        printf("1000\n");
        for(int i=0;i<1000;i++) printf("%lld\n",primes[rnd(0,9)]);
    }
    return 0;
}
