#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}

int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(9100+id);

    if(id==2){
        // small random - cross-checkable against brute force
        int T=300; printf("%d\n",T);
        while(T--){
            int n=rnd(1,5); printf("%d\n",n);
            for(int i=0;i<n;i++) printf("%lld%c",rnd(1,20),i+1<n?' ':'\n');
        }
    } else if(id==3){
        // medium mixed sizes and values
        int T=40; printf("%d\n",T);
        while(T--){
            int n=rnd(1,200); printf("%d\n",n);
            for(int i=0;i<n;i++) printf("%lld%c",rnd(1,5000),i+1<n?' ':'\n');
        }
    } else if(id==4){
        // performance: one max-n test, SMALL values (kills wrong complexity,
        // keeps the file small). sum n = 1e5.
        printf("1\n");
        int n=100000; printf("%d\n",n);
        for(int i=0;i<n;i++) printf("%lld%c",rnd(1,999),i+1<n?' ':'\n');
    } else if(id==5){
        // extreme values: large numbers, highly composite numbers, and large
        // primes - small n so the file stays tiny.
        long long hard[]={262144,177147,78125,390625,461041,499999,
                          30030,27720,483840,498960,491400,
                          499979,499957,499943,4,1,5,499711};
        int H=sizeof(hard)/sizeof(hard[0]);
        int T=600; printf("%d\n",T);
        for(int k=0;k<T;k++){
            if(k<H){ printf("1\n%lld\n",hard[k]); }
            else {
                int n=rnd(1,3); printf("%d\n",n);
                for(int i=0;i<n;i++) printf("%lld%c",rnd(400000,500000),i+1<n?' ':'\n');
            }
        }
    } else if(id==6){
        // answer-extreme / overflow: force the product past the modulus.
        // test 1: primes 2..29, 30 copies each -> each factor 31, 31^10 huge.
        // test 2: many equal values -> one very large S_p.
        int primes[]={2,3,5,7,11,13,17,19,23,29};
        int copies=30, P=10;
        printf("2\n");
        printf("%d\n", P*copies);
        for(int j=0;j<P;j++) for(int c=0;c<copies;c++)
            printf("%d%c",primes[j], (j==P-1&&c==copies-1)?'\n':' ');
        int n2=60000; printf("%d\n",n2);
        for(int i=0;i<n2;i++) printf("2%c",i+1<n2?' ':'\n');
    }
    return 0;
}
