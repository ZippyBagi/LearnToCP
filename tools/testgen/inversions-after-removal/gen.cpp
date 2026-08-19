#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}

long long inversionsOf(vector<long long>& a){ // O(n^2), only used to pick a sensible k
    long long c=0;
    for(size_t i=0;i<a.size();i++) for(size_t j=i+1;j<a.size();j++) if(a[i]>a[j]) c++;
    return c;
}

void emitArray(vector<long long>& a,long long k){
    printf("%d %lld\n",(int)a.size(),k);
    for(size_t i=0;i<a.size();i++) printf("%lld%c",a[i],i+1<a.size()?' ':'\n');
}

// k is picked around the array's own inversion count so the answer is neither 0
// nor everything - kMode 0 = tiny, 1 = around a fraction of it, 2 = huge
void emitRandom(int n,long long lo,long long hi,int kMode){
    vector<long long> a(n);
    for(auto &x:a) x=rnd(lo,hi);
    long long k;
    if(kMode==0) k=rnd(0,3);
    else if(kMode==2) k=1000000000000000000LL;
    else{
        long long inv = n<=4000 ? inversionsOf(a) : (long long)n*(n-1)/4;
        k=rnd(0,inv);
    }
    emitArray(a,k);
}

void emitSorted(int n,bool descending,long long k){
    vector<long long> a(n);
    for(int i=0;i<n;i++) a[i]= descending ? n-i : i+1;
    emitArray(a,k);
}

int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(8500+id);
    if(id==2){
        printf("10\n");
        for(int i=0;i<10;i++) emitRandom((int)rnd(2,8),1,4,(int)rnd(0,2));
    } else if(id==3){
        printf("10\n");
        for(int i=0;i<10;i++) emitRandom((int)rnd(2,300),1,1000000000LL,(int)rnd(0,2));
    } else if(id==4){
        printf("6\n");
        emitRandom(3000,1,1000000000LL,1);
        emitRandom(3000,1,3,1);          // heavy ties
        emitSorted(3000,false,0);        // already sorted, k = 0 - every pair works
        emitSorted(3000,true,0);         // reversed, k = 0 - nothing works
        emitSorted(3000,true,4500000);   // reversed with a generous budget
        emitRandom(3000,1,1000000000LL,0);
    } else if(id==5){
        // max n, three times. Small values keep the file down; the answer and the
        // running inversion count both go past 2 * 10^9 here.
        printf("2\n");
        emitRandom(100000,1,1000,1);
        emitSorted(100000,true,2500000000LL);
    } else if(id==6){
        // edges: the smallest legal n, all elements equal, k = 0 and k at its
        // maximum, and the two extreme values
        printf("9\n");
        printf("2 0\n1 1\n");
        printf("2 0\n2 1\n");
        printf("2 1\n2 1\n");
        printf("2 1000000000000000000\n1000000000 1\n");
        printf("3 0\n1 1 1\n");
        printf("5 0\n1000000000 1000000000 1000000000 1000000000 1000000000\n");
        printf("5 1000000000000000000\n5 4 3 2 1\n");
        emitSorted(50000,true,0);              // reversed, nothing works
        emitSorted(50000,false,1000000000000000000LL); // sorted, everything works
    }
    return 0;
}
