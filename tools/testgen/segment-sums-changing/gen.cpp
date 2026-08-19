#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}

// setShare is the percentage of operations that are of type s
void emitCase(int n,int m,int setShare){
    printf("%d %d\n",n,m);
    for(int i=0;i<n;i++) printf("%lld%c",rnd(0,10),i+1<n?' ':'\n');
    for(int e=0;e<m;e++){
        if(rnd(1,100)<=setShare){
            printf("s %lld %lld\n",rnd(0,n-1),rnd(0,10));
        }else{
            long long l=rnd(0,n-1), r=rnd(0,n-1);
            if(l>r) swap(l,r);
            printf("q %lld %lld\n",l,r);
        }
    }
}

// long ranges, so a scan per query really costs about n each time
void emitLongRanges(int n,int m,int setShare){
    printf("%d %d\n",n,m);
    for(int i=0;i<n;i++) printf("%lld%c",rnd(0,10),i+1<n?' ':'\n');
    for(int e=0;e<m;e++){
        if(rnd(1,100)<=setShare) printf("s %lld %lld\n",rnd(0,n-1),rnd(0,10));
        else printf("q %lld %lld\n",rnd(0,n/50),rnd(n-1-n/50,n-1));
    }
}

// every query spans the whole array
void emitFullRangeHeavy(int n,int m,int setShare){
    printf("%d %d\n",n,m);
    for(int i=0;i<n;i++) printf("%lld%c",rnd(0,10),i+1<n?' ':'\n');
    for(int e=0;e<m;e++){
        if(rnd(1,100)<=setShare) printf("s %lld %lld\n",rnd(0,n-1),rnd(0,10));
        else printf("q 0 %d\n",n-1);
    }
}

// only single-position queries - the shortest possible ranges
void emitPointHeavy(int n,int m){
    printf("%d %d\n",n,m);
    for(int i=0;i<n;i++) printf("%lld%c",rnd(0,10),i+1<n?' ':'\n');
    for(int e=0;e<m;e++){
        long long p=rnd(0,n-1);
        if(e%2) printf("s %lld %lld\n",p,rnd(0,10));
        else    printf("q %lld %lld\n",p,p);
    }
}

int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(8400+id);
    if(id==2){
        printf("10\n");
        for(int i=0;i<10;i++) emitCase((int)rnd(1,6),(int)rnd(1,6),40);
    } else if(id==3){
        printf("10\n");
        for(int i=0;i<10;i++) emitCase((int)rnd(1,300),(int)rnd(1,300),50);
    } else if(id==4){
        // sizes around powers of two, where the Fenwick parent hops fall off the end
        printf("7\n");
        emitCase(1024,2000,50);
        emitCase(1023,2000,50);
        emitCase(1025,2000,50);
        emitCase(1,50,50);
        emitCase(2,50,50);
        emitPointHeavy(2000,2000);
        emitCase(3000,3000,90); // almost nothing but updates
    } else if(id==5){
        // the kill: 10^5 elements and 10^5 operations, almost all of them a query
        // over the WHOLE array, which is the most a scan per query can be made to
        // do - about 10^10 steps. Ranges that are merely long are not enough:
        // -O2 vectorises the summing loop, and 5 * 10^9 steps still finished in
        // 1.05 s. See the docs entry.
        printf("1\n");
        emitFullRangeHeavy(100000,100000,5);
    } else if(id==6){
        // edges: one element, all zeros, all tens, full-range and single-position
        // queries, and setting a value to what it already was
        printf("7\n");
        printf("1 4\n7\nq 0 0\ns 0 0\nq 0 0\ns 0 10\n");
        printf("1 2\n0\nq 0 0\nq 0 0\n");
        printf("5 6\n0 0 0 0 0\nq 0 4\ns 2 10\nq 0 4\nq 2 2\ns 2 0\nq 0 4\n");
        printf("5 4\n10 10 10 10 10\nq 0 4\nq 1 3\ns 0 0\nq 0 4\n");
        printf("4 5\n1 2 3 4\ns 1 2\nq 0 3\ns 3 4\nq 0 3\nq 3 3\n");
        printf("8 3\n1 2 3 4 5 6 7 8\nq 0 7\nq 7 7\nq 0 0\n");
        printf("9 3\n1 2 3 4 5 6 7 8 9\nq 0 8\nq 8 8\nq 4 4\n");
    }
    return 0;
}
