#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}

// kWant pairings, drawn without repeating an (x, y) pair, as the statement demands
void emitCase(int n,int m,int kWant,long long alo,long long ahi,long long clo,long long chi){
    int kMax = n*(n-1);
    if(kWant > kMax) kWant = kMax;
    vector<pair<int,int>> all;
    for(int x=1;x<=n;x++) for(int y=1;y<=n;y++) if(x!=y) all.push_back({x,y});
    shuffle(all.begin(), all.end(), rng);
    printf("%d %d %d\n",n,m,kWant);
    for(int i=0;i<n;i++) printf("%lld%c",rnd(alo,ahi),i+1<n?' ':'\n');
    for(int i=0;i<kWant;i++) printf("%d %d %lld\n",all[i].first,all[i].second,rnd(clo,chi));
}

int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(8900+id);
    if(id==2){
        // tiny and brute-force checkable. t is capped at 5, so the handcrafted
        // edges are split between this file and 06 rather than piled into one.
        printf("5\n");
        for(int i=0;i<2;i++){
            int n=(int)rnd(1,5), m=(int)rnd(1,n);
            emitCase(n,m,(int)rnd(0,n*(n-1)),0,10,0,10);
        }
        printf("1 1 0\n0\n");                                    // the answer is 0
        printf("2 2 1\n0 0\n1 2 1000000000\n");                  // the pairing is the whole answer
        printf("2 2 1\n0 0\n2 1 1000000000\n");                  // same pairing, other direction
    } else if(id==3){
        // still brute-force checkable, but big enough that the order matters
        printf("5\n");
        for(int i=0;i<5;i++){
            int n=(int)rnd(6,9), m=(int)rnd(1,n);
            emitCase(n,m,(int)rnd(0,n*(n-1)),0,1000000000LL,0,1000000000LL);
        }
    } else if(id==4){
        // shapes: no pairings at all, pairings only, m = 1, m = n, and a case
        // where the bonuses dwarf the dishes so the order is what decides it
        printf("5\n");
        emitCase(10,5,0,0,1000000000LL,0,0);          // k = 0
        emitCase(10,10,90,0,0,0,1000000000LL);        // every a_i is 0
        emitCase(12,1,132,0,1000000000LL,0,1000000000LL); // m = 1 -> just the best dish
        emitCase(12,12,132,0,1000,0,1000000000LL);    // bonuses dominate
        emitCase(12,6,60,0,1000000000LL,0,5);         // dishes dominate
    } else if(id==5){
        // the full size: n = 18 with every pairing present and maximal values,
        // which is also where the answer reaches 3.5 * 10^10
        printf("5\n");
        emitCase(18,18,18*17,1000000000LL,1000000000LL,1000000000LL,1000000000LL);
        emitCase(18,18,18*17,0,1000000000LL,0,1000000000LL);
        emitCase(18,9,18*17,0,1000000000LL,0,1000000000LL);
        emitCase(18,1,18*17,0,1000000000LL,0,1000000000LL);
        emitCase(17,17,17*16,0,1000000000LL,0,1000000000LL);
    } else if(id==6){
        // edges: a single dish, everything zero, one dish chosen out of many,
        // pairings worth nothing, and a pairing that only helps in one direction
        printf("5\n");
        printf("1 1 0\n1000000000\n");                             // a single dish, maximal
        printf("2 1 2\n5 7\n1 2 1000000000\n2 1 1000000000\n");    // m = 1, so no pairing can apply
        printf("3 3 2\n0 0 0\n1 2 5\n2 3 7\n");                    // a chain, both pairings used -> 12
        printf("3 3 2\n0 0 0\n1 2 5\n3 2 7\n");                    // both point at 2, only one can count -> 7
        printf("4 2 3\n1 1 1 1\n1 2 0\n2 3 0\n3 4 0\n");           // every bonus is zero -> 2
    }
    return 0;
}
