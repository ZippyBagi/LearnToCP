#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}
void printArr(vector<long long>&a){for(size_t i=0;i<a.size();i++)printf("%lld%c",a[i],i+1<a.size()?' ':'\n');}
// values are built as (product of primes whose count > i) * multiplier coprime to 2*3*5*7,
// so for every queried product of these primes the divisible elements form a prefix
long long coprimeMultiplier(long long cap){
    while(true){
        long long m=rnd(1,cap);
        if(m%2!=0&&m%3!=0&&m%5!=0&&m%7!=0) return m;
    }
}
void emitCase(int n,int q,vector<int> primes,long long maxMult){
    int k=primes.size();
    vector<int> cnt(k);
    for(int j=0;j<k;j++) cnt[j]=rnd(0,n);
    vector<long long> a(n);
    for(int i=0;i<n;i++){
        long long prod=1;
        for(int j=0;j<k;j++) if(cnt[j]>i) prod*=primes[j];
        a[i]=prod*coprimeMultiplier(maxMult);
    }
    printf("%d %d\n",n,q);
    printArr(a);
    vector<long long> qs(q);
    for(auto &x:qs){
        int kind=rnd(0,9);
        if(kind==0) x=1;                                   // divides everything
        else if(kind==1) x=(long long)primes[rnd(0,k-1)]*primes[rnd(0,k-1)]; // may be a square - answer 0 then
        else {
            long long d=1;
            for(int j=0;j<k;j++) if(rnd(0,1)) d*=primes[j];
            if(d==1) d=primes[rnd(0,k-1)];
            x=d;
        }
    }
    printArr(qs);
}
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(2100+id);
    if(id==2){
        int t=50; printf("%d\n",t);
        for(int i=0;i<t;i++) emitCase(rnd(1,10),rnd(1,4),{2,3},1000);
    } else if(id==3){
        int t=10; printf("%d\n",t);
        for(int i=0;i<t;i++) emitCase(rnd(100,500),rnd(1,20),{2,3,5,7},1000000);
    } else if(id==4){
        printf("4\n");
        printf("1 3\n999999999999999983\n1 999999999999999983 2\n");   // n = 1, d = the element itself, d bigger than a prime factor
        emitCase(5,4,{2,3,5,7},4000000000000000LL);                    // huge values close to 10^18
        printf("4 3\n16 8 4 2\n4 16 32\n");                             // decreasing powers of two, counts 3, 1, 0
        printf("3 2\n6 10 15\n1 999999999999999989\n");                // d = 1 divides everything, huge d divides nothing
    } else if(id==5){
        printf("1\n");
        emitCase(200000,200000,{2,3,5,7},4000000000000000LL);
    }
    return 0;
}
