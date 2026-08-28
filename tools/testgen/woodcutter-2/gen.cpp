#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}

long long woodAt(vector<long long>&a,long long h){
    long long s=0;
    for(long long v:a) if(v>h) s+=v-h;
    return s;
}

// Orders are picked so that the answers spread over the whole range of heights:
// half of them aim at a random saw height, half are taken at random.
void emitCase(int n,int q,long long lo,long long hi){
    vector<long long> a(n);
    for(auto &v:a) v=rnd(lo,hi);
    long long total=0; for(long long v:a) total+=v;
    long long mx=*max_element(a.begin(),a.end());
    printf("%d %d\n",n,q);
    for(int i=0;i<n;i++) printf("%lld%c",a[i],i+1<n?' ':'\n');
    for(int i=0;i<q;i++){
        long long x;
        if(rnd(0,1)){
            x=woodAt(a,rnd(0,mx-1));
            if(x<1) x=1;
        }else{
            x=rnd(1,total);
        }
        printf("%lld%c",x,i+1<q?' ':'\n');
    }
}

int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(7800+id);
    if(id==2){
        printf("5\n");
        for(int i=0;i<5;i++) emitCase((int)rnd(1,5),(int)rnd(1,5),1,20);
    } else if(id==3){
        printf("5\n");
        for(int i=0;i<5;i++) emitCase((int)rnd(1,300),(int)rnd(1,300),1,1000000000LL);
    } else if(id==4){
        // overflow test: small n, maximal heights - the totals reach 5 * 10^12
        printf("2\n");
        emitCase(5000,5000,900000000LL,1000000000LL);
        emitCase(5000,5000,1,1000000000LL);
    } else if(id==5){
        // the kill: 10^5 trees against 2 * 10^4 orders is 2 * 10^9 steps for an
        // O(n) check. Heights stay 3-digit so the file stays under a megabyte.
        printf("1\n");
        emitCase(100000,20000,1,1000);
    } else if(id==6){
        // edges: single tree, all trees equal, x = the whole forest (answer 0),
        // x = 1 (answer one meter under the tallest), maximal heights
        printf("5\n");
        printf("1 3\n1000000000\n1 1000000000 999999999\n");
        printf("5 3\n1000000000 1000000000 1000000000 1000000000 1000000000\n1 5000000000 2500000000\n");
        printf("4 4\n1 1 1 1\n1 2 3 4\n");
        printf("6 3\n1000000000 1 1000000000 1 1000000000 1\n1 3000000000 1000000001\n");
        {   // many equal tall trees plus one taller, orders around both levels
            int n=2000,q=2000;
            printf("%d %d\n",n,q);
            for(int i=0;i<n;i++) printf("%d%c",i?999999999:1000000000,i+1<n?' ':'\n');
            for(int i=0;i<q;i++) printf("%lld%c",rnd(1,999999999LL*n),i+1<q?' ':'\n');
        }
    }
    return 0;
}
