#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}

// A random DAG: pick a random permutation as the "true" order, then only ever
// draw edges that agree with it, so an ordering is guaranteed to exist.
// Printed as "x y" meaning y comes before x - the upstream convention.
void emitDag(int n,int m){
    if(m > 10*n) m = 10*n; // the statement caps m at 10n
    vector<int> perm(n);
    for(int i=0;i<n;i++) perm[i]=i;
    shuffle(perm.begin(),perm.end(),rng);
    printf("%d %d\n",n,m);
    for(int e=0;e<m;e++){
        int i=rnd(0,n-2), j=rnd(i+1,n-1);
        printf("%d %d\n",perm[j],perm[i]); // perm[i] must come before perm[j]
    }
}

// A long chain plus extra forward edges - forces one single valid order when
// there are no extras, so the answer is fully determined by the chain
void emitChain(int n,int extra){
    if(n - 1 + extra > 10*n) extra = 10*n - (n-1); // keep m within 10n
    vector<int> perm(n);
    for(int i=0;i<n;i++) perm[i]=i;
    shuffle(perm.begin(),perm.end(),rng);
    printf("%d %d\n",n,n-1+extra);
    for(int i=0;i+1<n;i++) printf("%d %d\n",perm[i+1],perm[i]);
    for(int e=0;e<extra;e++){
        int i=rnd(0,n-2), j=rnd(i+1,n-1);
        printf("%d %d\n",perm[j],perm[i]);
    }
}

// Forces the single order n-1, n-2, ..., 0 by chaining "i+1 before i".
// This is the kill: a solution that rescans all jobs for the smallest ready one
// finds it at the far end every single step, so it degrades to n^2 / 2.
void emitDescendingChain(int n){
    printf("%d %d\n",n,n-1);
    for(int i=0;i+1<n;i++) printf("%d %d\n",i,i+1); // i+1 has to come before i
}

// No edges at all except duplicates of one - the answer is then 0 1 2 ... n-1
void emitSparse(int n,int m){
    if(m > 10*n) m = 10*n;
    printf("%d %d\n",n,m);
    for(int e=0;e<m;e++) printf("%d %d\n",n-1,0); // 0 before n-1, repeated
}

int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(8600+id);
    if(id==2){
        printf("10\n");
        for(int i=0;i<10;i++) emitDag((int)rnd(2,6),(int)rnd(1,8));
    } else if(id==3){
        printf("10\n");
        for(int i=0;i<10;i++) emitDag((int)rnd(2,400),(int)rnd(1,800));
    } else if(id==4){
        printf("6\n");
        emitChain(3000,0);         // exactly one valid order
        emitChain(3000,3000);
        emitDag(3000,20000);       // dense, lots of freedom in the heap
        emitSparse(3000,3000);     // duplicate edges everywhere
        emitDag(3000,3000);
        emitChain(2000,10000);
    } else if(id==5){
        // max n. The first case is the kill: a rescan for the smallest ready job
        // walks almost the whole array every step, so it degrades to n^2 / 2.
        // A random DAG does NOT do this - its ready set is large, so the scan
        // finds a job almost immediately. See the docs entry.
        printf("2\n");
        emitDescendingChain(50000);
        emitDescendingChain(50000);
    } else if(id==6){
        // edges: one job, two jobs both ways round, self-consistent duplicates,
        // and a graph with no dependencies at all
        printf("8\n");
        printf("2 1\n1 0\n");        // the smallest legal graph
        printf("2 2\n1 0\n1 0\n");   // the same edge twice
        printf("2 1\n0 1\n");        // 1 before 0
        printf("3 1\n2 0\n");
        printf("5 4\n1 0\n2 0\n3 0\n4 0\n");   // everything waits on 0
        printf("5 4\n4 0\n4 1\n4 2\n4 3\n");   // 4 waits on everything
        printf("6 3\n1 0\n1 0\n1 0\n");        // the same edge three times
        emitSparse(2000,1);
    }
    return 0;
}
