#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}

// acyclic: draw every edge forward along a random permutation
void emitDag(int v,int e){
    vector<int> perm(v);
    for(int i=0;i<v;i++) perm[i]=i;
    shuffle(perm.begin(),perm.end(),rng);
    printf("%d %d\n",v,e);
    for(int i=0;i<e;i++){
        int a=rnd(0,v-2), b=rnd(a+1,v-1);
        printf("%d %d\n",perm[a],perm[b]);
    }
}

// One small cycle hidden inside an otherwise acyclic graph - the hardest shape
// to get right, because everything else about the graph looks fine.
// A lone backward edge is NOT enough: it only closes a cycle if a forward path
// already runs the other way, which random edges rarely provide. So we lay down
// the forward chain perm[i] -> ... -> perm[i+len] explicitly and then close it.
void emitOneBackEdge(int v,int e){
    vector<int> perm(v);
    for(int i=0;i<v;i++) perm[i]=i;
    shuffle(perm.begin(),perm.end(),rng);
    int len = (int)rnd(1, min(v-1, 5)); // the cycle spans len+1 planets
    int start = (int)rnd(0, v-1-len);
    if(e < len+1) e = len+1;            // room for the chain and the closing edge
    printf("%d %d\n",v,e);
    for(int i=0;i<len;i++) printf("%d %d\n",perm[start+i],perm[start+i+1]); // the chain
    printf("%d %d\n",perm[start+len],perm[start]);                          // closes it
    for(int i=len+1;i<e;i++){ // the rest is ordinary forward filler
        int a=rnd(0,v-2), b=rnd(a+1,v-1);
        printf("%d %d\n",perm[a],perm[b]);
    }
}

// one big cycle through every planet
void emitBigCycle(int v){
    vector<int> perm(v);
    for(int i=0;i<v;i++) perm[i]=i;
    shuffle(perm.begin(),perm.end(),rng);
    printf("%d %d\n",v,v);
    for(int i=0;i<v;i++) printf("%d %d\n",perm[i],perm[(i+1)%v]);
}

int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(8700+id);
    if(id==2){
        printf("20\n");
        for(int i=0;i<10;i++) emitDag((int)rnd(2,6),(int)rnd(1,8));
        for(int i=0;i<10;i++) emitOneBackEdge((int)rnd(2,6),(int)rnd(2,8));
    } else if(id==3){
        printf("20\n");
        for(int i=0;i<10;i++) emitDag((int)rnd(2,300),(int)rnd(1,600));
        for(int i=0;i<10;i++) emitOneBackEdge((int)rnd(2,300),(int)rnd(2,600));
    } else if(id==4){
        printf("8\n");
        emitBigCycle(5000);
        emitDag(5000,10000);
        emitOneBackEdge(5000,10000);
        emitDag(5000,20000);
        emitOneBackEdge(5000,20000);
        emitBigCycle(3000);
        emitDag(3000,3000);
        emitOneBackEdge(3000,3000);
    } else if(id==5){
        // the edge budget spent on as few worlds as possible, half acyclic and
        // half with a single back edge, so neither answer can be guessed
        printf("4\n");
        for(int i=0;i<2;i++) emitDag(5000,20000);
        for(int i=0;i<2;i++) emitOneBackEdge(5000,20000);
    } else if(id==6){
        // edges: a two-planet world both ways, a self-loop (a planet that
        // teleports to itself is a cycle of length one), duplicate edges, and a
        // graph split into pieces where only one piece has the cycle
        printf("9\n");
        printf("2 1\n0 1\n");                  // no
        printf("2 2\n0 1\n1 0\n");             // yes, the shortest real cycle
        printf("2 1\n0 0\n");                  // yes, a self-loop
        printf("3 3\n0 1\n1 2\n2 0\n");        // yes
        printf("3 3\n0 1\n0 1\n0 1\n");        // no, the same edge repeated
        printf("4 2\n0 1\n2 3\n");             // no, two separate pieces
        printf("6 4\n0 1\n2 3\n4 5\n5 4\n");   // yes, only the last piece loops
        printf("5 4\n0 1\n1 2\n2 3\n3 4\n");   // no, a plain chain
        printf("5 5\n0 1\n1 2\n2 3\n3 4\n4 4\n"); // yes, self-loop at the far end
    }
    return 0;
}
