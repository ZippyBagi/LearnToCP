#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}

void emit(vector<int>& a, vector<pair<int,int>>& qs){
    printf("%d\n",(int)a.size());
    for(size_t i=0;i<a.size();i++) printf("%d%c",a[i],i+1<a.size()?' ':'\n');
    printf("%d\n",(int)qs.size());
    for(auto &p:qs) printf("%d %d\n",p.first,p.second);
}

// plain random: the running AND collapses to 0 within a few steps, so most
// answers sit very close to l
void emitRandom(int n,int q,long long alo,long long ahi,long long klo,long long khi){
    vector<int> a(n);
    for(auto &x:a) x=(int)rnd(alo,ahi);
    vector<pair<int,int>> qs(q);
    for(auto &p:qs) p={(int)rnd(1,n),(int)rnd(klo,khi)};
    emit(a,qs);
}

// Every value carries the same high bit, so the running AND never falls below
// it and the answer is far from l. This is the shape that denies a walk-right
// solution its early exit - see the docs entry.
void emitSticky(int n,int q,int bit,int lHi){
    vector<int> a(n);
    for(auto &x:a) x=(1<<bit) + (int)rnd(0,(1<<bit)-1);
    vector<pair<int,int>> qs(q);
    for(auto &p:qs) p={(int)rnd(1,max(1,lHi)),(int)rnd(1,1<<bit)};
    emit(a,qs);
}

// all values equal, so f(l,r) is that value for every r. k is drawn on both
// sides of v so the file carries answers and -1 alike, clamped to the stated
// 1 <= k <= 10^9.
void emitConstant(int n,int q,int v){
    vector<int> a(n,v);
    long long kHi = min(2LL*v, 1000000000LL);
    vector<pair<int,int>> qs(q);
    for(auto &p:qs) p={(int)rnd(1,n),(int)rnd(1,kHi)};
    emit(a,qs);
}

int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(9400+id);
    if(id==2){
        // tiny, brute-force checkable end to end
        printf("10\n");
        for(int i=0;i<10;i++){ int n=(int)rnd(1,6); emitRandom(n,(int)rnd(1,6),1,15,1,15); }
    } else if(id==3){
        printf("8\n");
        for(int i=0;i<4;i++){ int n=(int)rnd(20,300); emitRandom(n,(int)rnd(20,300),1,1000000000LL,1,1000000000LL); }
        for(int i=0;i<4;i++){ int n=(int)rnd(20,300); emitSticky(n,(int)rnd(20,300),9,n); }
    } else if(id==4){
        // shapes: constant arrays, a sticky one, and one where every answer is -1
        printf("5\n");
        emitConstant(2000,2000,1000000000);
        emitConstant(2000,2000,1);
        emitSticky(2000,2000,20,2000);
        emitRandom(2000,2000,1,3,1000000000LL,1000000000LL); // k always too big -> all -1
        emitRandom(2000,2000,1,1000000000LL,1,2);            // k always tiny -> answers run long
    } else if(id==5){
        // the heavy file: the running AND never drops, and the questions start
        // near the left end, so a walk-right solution scans the whole array
        // every single time. 3-digit values keep this under a megabyte.
        printf("1\n");
        emitSticky(100000,100000,9,9);
    } else if(id==6){
        // edges: n = 1, k above and below a_1, the largest allowed values, and
        // a query at the very last position
        printf("6\n");
        {vector<int> a={5}; vector<pair<int,int>> q={{1,5},{1,6},{1,1}}; emit(a,q);}
        {vector<int> a={1000000000}; vector<pair<int,int>> q={{1,1000000000}}; emit(a,q);}
        {vector<int> a={1,1000000000}; vector<pair<int,int>> q={{1,1},{2,1000000000},{2,1}}; emit(a,q);}
        {vector<int> a={1000000000,1000000000}; vector<pair<int,int>> q={{1,1000000000},{1,1}}; emit(a,q);}
        {vector<int> a={7,7,7,7}; vector<pair<int,int>> q={{4,7},{1,8},{1,7}}; emit(a,q);}
        {vector<int> a={2,1}; vector<pair<int,int>> q={{1,2},{1,1},{2,2}}; emit(a,q);}
    }
    return 0;
}
