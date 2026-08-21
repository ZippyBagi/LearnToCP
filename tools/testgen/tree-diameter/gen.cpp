#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}

// Every shape builds a parent array over 0..n-1 (par[0] unused) and hands it
// here. Labels and edge lines are both shuffled, so nothing about the shape is
// readable from the numbering. oneIndex, when it is not -1, forces outpost 1
// onto that position - the shapes that exist to punish "search once from 1" only
// punish it if outpost 1 really sits where the shape puts it.
void emit(int n,const vector<int>& par,int oneIndex){
    vector<int> lab(n);
    for(int i=0;i<n;i++) lab[i]=i+1;
    shuffle(lab.begin(),lab.end(),rng);
    if(oneIndex>=0){
        for(int i=0;i<n;i++) if(lab[i]==1){ swap(lab[i],lab[oneIndex]); break; }
    }
    vector<pair<int,int>> edges;
    for(int i=1;i<n;i++){
        int a=lab[par[i]], b=lab[i];
        if(rnd(0,1)) swap(a,b);
        edges.push_back({a,b});
    }
    shuffle(edges.begin(),edges.end(),rng);
    printf("%d\n",n);
    for(size_t i=0;i<edges.size();i++) printf("%d %d\n",edges[i].first,edges[i].second);
}

// Each new outpost attaches to a random older one: shallow and bushy, diameter
// around 2 log n.
void emitRandom(int n){
    vector<int> par(n,0);
    for(int i=1;i<n;i++) par[i]=(int)rnd(0,i-1);
    emit(n,par,-1);
}

// A path - the largest diameter n - 1 can be, and the deepest queue.
void emitPath(int n){
    vector<int> par(n,0);
    for(int i=1;i<n;i++) par[i]=i-1;
    emit(n,par,-1);
}

// A star: diameter 2 however large n gets.
void emitStar(int n){
    vector<int> par(n,0);
    emit(n,par,-1);
}

// A complete binary tree: diameter twice the depth.
void emitBinary(int n){
    vector<int> par(n,0);
    for(int i=1;i<n;i++) par[i]=(i-1)/2;
    emit(n,par,-1);
}

// A caterpillar: a long spine with legs, so the diameter is the spine plus two.
void emitCaterpillar(int n){
    vector<int> par(n,0);
    int spine=max(2,n/2);
    for(int i=1;i<spine;i++) par[i]=i-1;
    for(int i=spine;i<n;i++) par[i]=(int)rnd(0,spine-1);
    emit(n,par,-1);
}

// The shape that punishes searching only once. Outpost 1 hangs off the centre of
// a spider with `arms` equal legs, so from outpost 1 the farthest anything gets
// is one leg plus one, while the real longest route runs leg to leg through the
// centre and never touches outpost 1 at all.
void emitSpiderTail(int n,int arms){
    vector<int> par(n,0);
    if(n<3){ emit(n,par,0); return; } // nothing to hang a spider on
    par[1]=0; // 0 is outpost 1, 1 is the centre
    int idx=2, rem=n-2;
    for(int a=0;a<arms && idx<n;a++){
        int len=rem/(arms-a); rem-=len;
        int prev=1;
        for(int i=0;i<len;i++){ par[idx]=prev; prev=idx; idx++; }
    }
    emit(n,par,0);
}

int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(7700+id);
    if(id==2){
        // tiny, so every answer can be re-derived by hand or by exhaustion
        printf("40\n");
        for(int i=0;i<20;i++) emitRandom((int)rnd(1,8));
        for(int i=0;i<10;i++) emitPath((int)rnd(1,8));
        for(int i=0;i<5;i++) emitStar((int)rnd(1,8));
        for(int i=0;i<5;i++) emitSpiderTail((int)rnd(4,8),3);
    } else if(id==3){
        // medium mixed shapes, still inside reach of the O(n^2) checker
        printf("30\n");
        for(int i=0;i<10;i++) emitRandom((int)rnd(50,400));
        for(int i=0;i<7;i++) emitCaterpillar((int)rnd(50,400));
        for(int i=0;i<7;i++) emitBinary((int)rnd(50,400));
        for(int i=0;i<6;i++) emitSpiderTail((int)rnd(50,400),(int)rnd(2,5));
    } else if(id==4){
        // the shapes, at a scale where a wrong first search is off by thousands
        printf("6\n");
        emitPath(8000);
        emitStar(8000);
        emitBinary(8000);
        emitCaterpillar(8000);
        emitSpiderTail(8000,3);
        emitRandom(8000);
    } else if(id==5){
        // max size, a single path: the largest possible answer, the deepest
        // queue, and the file where an O(n^2) all pairs search has no chance.
        // One testcase, not two - a second would double the file for nothing.
        printf("1\n");
        emitPath(100000);
    } else if(id==6){
        // edges: the smallest trees, both n = 2 orientations, and the spider trap
        // at a size where being one leg short is unmistakable
        printf("8\n");
        printf("1\n");                // one outpost, no trails at all
        printf("2\n1 2\n");           // a single trail
        printf("2\n2 1\n");           // the same, written the other way round
        printf("3\n1 2\n2 3\n");      // outpost 1 at one end
        printf("3\n2 1\n2 3\n");      // outpost 1 in the middle
        emitSpiderTail(20000,4);
        emitSpiderTail(20000,2);
        emitBinary(1023);             // a complete binary tree, depth 9
    }
    return 0;
}
