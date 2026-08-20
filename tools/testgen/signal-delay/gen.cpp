#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}

// Fully random directed graph. Often leaves some computer unreachable, which is
// exactly what makes the -1 branch appear on its own.
void emitRandom(int n,int m,int wlo,int whi){
    printf("%d %d\n",n,m);
    for(int i=0;i<m;i++) printf("%lld %lld %lld\n",rnd(1,n),rnd(1,n),rnd(wlo,whi));
    printf("%lld\n",rnd(1,n));
}

// Connected from computer 1: a random spanning tree oriented away from the root
// guarantees every computer is reachable, so the answer is never -1 and the real
// shortest-path work is what decides it.
void emitReachable(int n,int m,int wlo,int whi){
    vector<int> perm(n);
    for(int i=0;i<n;i++) perm[i]=i+1;
    shuffle(perm.begin()+1,perm.end(),rng); // perm[0] stays the start
    if(m < n-1) m = n-1;
    printf("%d %d\n",n,m);
    for(int i=1;i<n;i++) printf("%d %d %lld\n",perm[rnd(0,i-1)],perm[i],rnd(wlo,whi));
    for(int i=n-1;i<m;i++) printf("%lld %lld %lld\n",rnd(1,n),rnd(1,n),rnd(wlo,whi));
    printf("%d\n",perm[0]);
}

// A long path 1 -> 2 -> ... -> n, every channel at the maximum weight, so the
// answer is (n-1) * w - the largest it can possibly be.
// No shortcut edge here: any single channel from 1 to n would have to weigh at
// most 1000 and would therefore beat the whole path, changing the answer.
void emitLongPath(int n,int w){
    printf("%d %d\n",n,n-1);
    for(int i=1;i<n;i++) printf("%d %d %d\n",i,i+1,w);
    printf("1\n");
}

int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(8800+id);
    if(id==2){
        // tiny, a mix of reachable and not
        printf("10\n");
        for(int i=0;i<5;i++) emitRandom((int)rnd(1,5),(int)rnd(1,6),1,10);
        for(int i=0;i<5;i++) emitReachable((int)rnd(2,5),(int)rnd(1,8),1,10);
    } else if(id==3){
        printf("10\n");
        for(int i=0;i<5;i++) emitRandom((int)rnd(2,200),(int)rnd(1,400),1,1000);
        for(int i=0;i<5;i++) emitReachable((int)rnd(2,200),(int)rnd(1,400),1,1000);
    } else if(id==4){
        // shapes: dense, sparse-but-connected, the maximal answer, and a graph
        // where the direct channel is always worse than a two-hop route
        printf("6\n");
        emitReachable(1000,20000,1,1000);
        emitRandom(1000,20000,1,1000);
        emitLongPath(1000,1000);
        emitReachable(500,1200,1,1000); // 500, not 1000, to stay inside sum n <= 5000
        emitReachable(1000,20000,1000,1000); // every channel the same weight
        emitRandom(500,20000,1,3);           // heavy ties on tiny weights
    } else if(id==5){
        // max n with a heavy edge load. There is no wrong-complexity solution to
        // kill here - at n <= 1000 even an O(n^2) Dijkstra passes - so this test
        // only has to show the reference is comfortable at full size, and one
        // testcase is enough. Two would double the file for nothing.
        printf("1\n");
        emitReachable(1000,80000,1,1000);
    } else if(id==6){
        // edges: one computer, a self-loop, duplicate channels, an unreachable
        // computer, a start that reaches nothing, and maximal weights
        printf("9\n");
        printf("1 1\n1 1 1000\n1\n");            // alone, already has it -> 0
        printf("2 1\n1 2 1000\n1\n");            // -> 1000
        printf("2 1\n2 1 1000\n1\n");            // 2 unreachable -> -1
        printf("2 1\n1 2 1\n2\n");               // starting at the far end -> -1
        printf("3 4\n1 2 5\n1 2 3\n1 2 9\n2 3 1\n1\n"); // duplicates, best is 3 -> 4
        printf("3 3\n1 1 7\n1 2 4\n2 3 4\n1\n"); // self-loop on the start -> 8
        printf("4 4\n1 2 1\n2 3 1\n3 4 1\n1 4 1000\n1\n"); // shortcut is worse -> 3
        printf("4 3\n1 2 1\n2 3 1\n3 1 1\n1\n"); // a cycle, 4 unreachable -> -1
        emitLongPath(1000,1000);                 // 999000, the largest answer
    }
    return 0;
}
