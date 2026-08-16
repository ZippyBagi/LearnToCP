#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}

// updateShare is the percentage of events that are of type b
void emitCase(int n,int q,long long lo,long long hi,int updateShare){
    printf("%d %d\n",n,q);
    for(int i=0;i<n;i++) printf("%lld%c",rnd(lo,hi),i+1<n?' ':'\n');
    for(int e=0;e<q;e++){
        if(rnd(1,100)<=updateShare){
            printf("b %lld %lld\n",rnd(0,n-1),rnd(lo,hi));
        }else{
            long long l=rnd(0,n-1), r=rnd(0,n-1);
            if(l>r) swap(l,r);
            printf("a %lld %lld\n",l,r);
        }
    }
}

// every event touches a single position - the shortest possible ranges
void emitPointHeavy(int n,int q,long long lo,long long hi){
    printf("%d %d\n",n,q);
    for(int i=0;i<n;i++) printf("%lld%c",rnd(lo,hi),i+1<n?' ':'\n');
    for(int e=0;e<q;e++){
        long long p=rnd(0,n-1);
        if(e%2) printf("b %lld %lld\n",p,rnd(lo,hi));
        else    printf("a %lld %lld\n",p,p);
    }
}

// long ranges on purpose: a scan per query then costs about n each time. Random
// l <= r only averages n/3 and -O2 vectorises the scan, which is not enough to
// kill it - see the docs entry.
void emitLongRanges(int n,int q,long long lo,long long hi,int updateShare){
    printf("%d %d\n",n,q);
    for(int i=0;i<n;i++) printf("%lld%c",rnd(lo,hi),i+1<n?' ':'\n');
    for(int e=0;e<q;e++){
        if(rnd(1,100)<=updateShare){
            printf("b %lld %lld\n",rnd(0,n-1),rnd(lo,hi));
        }else{
            printf("a %lld %lld\n",rnd(0,n/50),rnd(n-1-n/50,n-1));
        }
    }
}

// always the whole row, so every query has to reach the root
void emitFullRange(int n,int q,long long lo,long long hi){
    printf("%d %d\n",n,q);
    for(int i=0;i<n;i++) printf("%lld%c",rnd(lo,hi),i+1<n?' ':'\n');
    for(int e=0;e<q;e++){
        if(e%3==0) printf("b %lld %lld\n",rnd(0,n-1),rnd(lo,hi));
        else       printf("a 0 %d\n",n-1);
    }
}

int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(8300+id);
    if(id==2){
        // tiny, with negatives and plenty of ties
        printf("10\n");
        for(int i=0;i<10;i++) emitCase((int)rnd(1,6),(int)rnd(1,6),-10,10,40);
    } else if(id==3){
        printf("10\n");
        for(int i=0;i<10;i++) emitCase((int)rnd(1,300),(int)rnd(1,300),-1000000000LL,1000000000LL,50);
    } else if(id==4){
        // sizes around powers of two, where the padding lives
        printf("6\n");
        emitCase(1024,2000,-1000,1000,50);
        emitCase(1025,2000,-1000,1000,50);
        emitCase(1023,2000,-1000,1000,50);
        emitPointHeavy(2000,2000,-1000000000LL,1000000000LL);
        emitFullRange(2000,2000,-1000,1000);
        emitCase(3000,3000,-3,3,50); // almost everything is a tie
    } else if(id==5){
        // the kill: 10^5 sensors, 6 * 10^4 events, and the ranges are nearly the
        // whole row, so a scan per query is about 5 * 10^9 steps (2.1 s measured
        // against a 1 s limit). One-digit readings keep the file under a
        // megabyte.
        printf("1\n");
        emitLongRanges(100000,60000,-9,9,10);
    } else if(id==6){
        // edges: a single sensor, all readings equal, everything negative (the
        // trap for a starting value of 0), the extreme values, and updates that
        // remove and restore the maximum
        printf("8\n");
        printf("1 3\n5\na 0 0\nb 0 -1000000000\na 0 0\n");
        printf("1 2\n-7\nb 0 1000000000\na 0 0\n");
        printf("4 3\n-5 -5 -5 -5\na 0 3\na 1 2\na 2 2\n");
        printf("5 6\n-1 -2 -3 -4 -5\na 0 4\na 3 4\nb 2 -100\na 0 4\nb 0 -1000000000\na 0 4\n");
        printf("3 6\n1000000000 -1000000000 1000000000\na 0 2\na 1 1\nb 0 -1000000000\na 0 1\nb 2 -1000000000\na 0 2\n");
        printf("8 4\n1 2 3 4 5 6 7 8\na 0 7\nb 7 -9\na 0 7\na 7 7\n");
        printf("9 4\n1 2 3 4 5 6 7 8 9\na 0 8\nb 8 -9\na 0 8\na 8 8\n");
        emitCase(2,4,-1000000000LL,1000000000LL,50);
    }
    return 0;
}
