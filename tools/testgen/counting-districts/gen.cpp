#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}

// Every shape below builds a parent array over 0..n-1 (par[0] unused) and then
// hands it here. The labels are shuffled and the edge lines are shuffled too, so
// no shape can be recognised from the numbering - a solution that assumes city 1
// is the root, or that u < v, gets nothing for free.
void emit(int n,int k,const vector<int>& par){
    vector<int> lab(n);
    for(int i=0;i<n;i++) lab[i]=i+1;
    shuffle(lab.begin(),lab.end(),rng);
    vector<pair<int,int>> edges;
    for(int i=1;i<n;i++){
        int a=lab[par[i]], b=lab[i];
        if(rnd(0,1)) swap(a,b);
        edges.push_back({a,b});
    }
    shuffle(edges.begin(),edges.end(),rng);
    printf("%d %d\n",n,k);
    for(size_t i=0;i<edges.size();i++) printf("%d %d\n",edges[i].first,edges[i].second);
}

// A uniformly grown tree: each new city attaches to a random older one. Shallow
// and bushy, so most subtrees are small and the merge is exercised widely.
void emitRandom(int n,int k){
    vector<int> par(n,0);
    for(int i=1;i<n;i++) par[i]=(int)rnd(0,i-1);
    emit(n,k,par);
}

// A path. The answer is a closed form: sum over j = 1..min(k,n) of (n - j + 1).
void emitPath(int n,int k){
    vector<int> par(n,0);
    for(int i=1;i<n;i++) par[i]=i-1;
    emit(n,k,par);
}

// A star. The answer is n + sum over j = 2..k of C(n-1, j-1) - the worst case for
// anything that tries to enumerate districts one by one.
void emitStar(int n,int k){
    vector<int> par(n,0);
    emit(n,k,par);
}

// A complete binary tree. Depth log n, every node merging two children.
void emitBinary(int n,int k){
    vector<int> par(n,0);
    for(int i=1;i<n;i++) par[i]=(i-1)/2;
    emit(n,k,par);
}

// A caterpillar: a spine with legs hanging off it. Long and thin like a path,
// but every spine node has several children, so the merge runs more than once
// per node with sizes that are already capped.
void emitCaterpillar(int n,int k){
    vector<int> par(n,0);
    int spine=max(2,n/4), next=spine;
    for(int i=1;i<spine;i++) par[i]=i-1;
    for(int i=next;i<n;i++) par[i]=(int)rnd(0,spine-1);
    emit(n,k,par);
}

// A broom: half a path, then everything else hanging off its far end. The deep
// half keeps subtree sizes growing one at a time, the head is a star.
void emitBroom(int n,int k){
    vector<int> par(n,0);
    int handle=max(1,n/2);
    for(int i=1;i<handle;i++) par[i]=i-1;
    for(int i=handle;i<n;i++) par[i]=handle-1;
    emit(n,k,par);
}

int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(4400+id);
    if(id==2){
        // tiny, so brute.cpp can enumerate every subset of every one of them
        printf("40\n");
        for(int i=0;i<20;i++) emitRandom((int)rnd(1,8),(int)rnd(1,8));
        for(int i=0;i<10;i++) emitPath((int)rnd(1,8),(int)rnd(1,10));
        for(int i=0;i<10;i++) emitStar((int)rnd(1,8),(int)rnd(1,10));
    } else if(id==3){
        // medium, still inside reach of an independent O(n^2 * k) checker
        printf("30\n");
        for(int i=0;i<15;i++) emitRandom((int)rnd(20,150),(int)rnd(1,100));
        for(int i=0;i<8;i++) emitCaterpillar((int)rnd(20,150),(int)rnd(1,100));
        for(int i=0;i<7;i++) emitBinary((int)rnd(20,150),(int)rnd(1,100));
    } else if(id==4){
        // the shapes whose answers have a closed form, at full size
        printf("5\n");
        emitPath(1000,100);
        emitStar(1000,100);
        emitBinary(1000,100);
        emitCaterpillar(1000,100);
        emitBroom(1000,100);
    } else if(id==5){
        // max size: sum of n at the limit with k at the limit, which is where the
        // capped merge earns its O(n * k). Values are small by construction here -
        // the input is only city numbers - so the file stays tiny anyway.
        printf("5\n");
        for(int i=0;i<5;i++) emitRandom(1000,100);
    } else if(id==6){
        // edges: the smallest trees, k = 1, k far above n, and the two shapes with
        // the extreme answers (a star, which explodes, and a path, which does not)
        printf("11\n");
        printf("1 1\n");                 // one city, one district
        printf("1 100\n");               // k above n, still one district
        emitPath(2,1);                   // two cities, only the singletons
        emitPath(2,2);
        emitPath(2,100);                 // k above n again
        emitStar(1000,1);                // every district is a single city
        emitPath(1000,1);
        emitStar(1000,100);              // the largest answer in the set
        emitPath(1000,100);              // 95050, small enough to check by hand
        emitBinary(500,2);               // only cities and roads: n + (n-1)
        emitRandom(492,100);
    }
    return 0;
}
