#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}
void emitCase(int n,long long hi,long long maxLen){
    printf("%d\n",n);
    for(int i=0;i<n;i++){
        long long a=rnd(0,hi-1);
        long long b=min(hi,a+rnd(1,maxLen));
        printf("%lld %lld\n",a,b);
    }
}
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(3500+id);
    if(id==2){
        printf("200\n");
        for(int i=0;i<200;i++) emitCase(rnd(1,8),20,10);
    } else if(id==3){
        printf("20\n");
        for(int i=0;i<20;i++) emitCase(rnd(1,300),1000,200);
    } else if(id==4){
        // edges: touching intervals (b of one = a of another), identical intervals, single visitor
        printf("4\n");
        printf("3\n1 5\n5 9\n9 12\n");
        printf("4\n10 20\n10 20\n10 20\n10 20\n");
        printf("1\n0 1000000000\n");
        printf("5\n0 1\n1 2\n2 3\n3 4\n4 5\n");
    } else if(id==5){
        printf("1\n");
        emitCase(70000,1000000LL,10000LL); // enough to kill O(n^2); 7-digit times keep the file small
    } else if(id==6){
        // everyone overlaps around one point - answer close to n
        int n=70000;
        printf("1\n%d\n",n);
        for(int i=0;i<n;i++){
            long long a=rnd(0,500000LL),b=rnd(500001LL,1000000LL);
            printf("%lld %lld\n",a,b);
        }
    }
    return 0;
}
