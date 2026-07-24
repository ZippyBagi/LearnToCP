#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(2700+id);
    if(id==2){
        printf("200\n");
        for(int i=0;i<200;i++){long long a=rnd(1,100),b=rnd(a,100);printf("%lld %lld\n",a,b);}
    } else if(id==3){
        printf("200\n");
        for(int i=0;i<200;i++){long long a=rnd(1,10000),b=rnd(a,10000);printf("%lld %lld\n",a,b);}
    } else if(id==4){
        // edges: single point (prime and composite), full range, borders
        printf("6\n1 1\n2 2\n999983 999983\n1 1000000\n999982 999984\n1 2\n");
    } else if(id==5){
        printf("30000\n");
        for(int i=0;i<30000;i++){long long a=rnd(1,1000000),b=rnd(a,1000000);printf("%lld %lld\n",a,b);}
    }
    return 0;
}
