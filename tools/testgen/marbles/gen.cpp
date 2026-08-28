#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}

void emitRow(vector<int>& a){
    printf("%d\n",(int)a.size());
    for(size_t i=0;i<a.size();i++) printf("%d%c",a[i],i+1<a.size()?' ':'\n');
}

// n marbles drawn from the first c colours
void emitRandom(int n,int c){
    vector<int> a(n);
    for(auto &x:a) x=(int)rnd(1,c);
    emitRow(a);
}

// already tidy, then lightly stirred - the answer is small but not zero
void emitNearlyTidy(int n,int c,int swaps){
    vector<int> a;
    for(int col=1;col<=c;col++) for(int i=0;i<n/c;i++) a.push_back(col);
    while((int)a.size()<n) a.push_back(c);
    for(int s=0;s<swaps;s++){
        int i=(int)rnd(0,(int)a.size()-2);
        swap(a[i],a[i+1]);
    }
    emitRow(a);
}

// blocks laid out in reverse, which costs nothing at all - the order of the
// blocks is free, so a tidy row is tidy however its blocks are arranged
void emitTidy(int n,int c){
    vector<int> a;
    for(int col=c;col>=1;col--) for(int i=0;i<n/c;i++) a.push_back(col);
    while((int)a.size()<n) a.push_back(1);
    emitRow(a);
}

// the worst shape for the answer: colours strictly interleaved, so almost every
// pair of different colours has to cross
void emitInterleaved(int n,int c){
    vector<int> a(n);
    for(int i=0;i<n;i++) a[i]=(i%c)+1;
    emitRow(a);
}

int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(9200+id);
    if(id==2){
        // tiny, and few enough colours for the k! brute force
        printf("5\n");
        for(int i=0;i<5;i++) emitRandom((int)rnd(2,9),(int)rnd(1,4));
    } else if(id==3){
        // still brute-force checkable, up to 6 colours
        printf("5\n");
        for(int i=0;i<5;i++) emitRandom((int)rnd(10,60),(int)rnd(2,6));
        // sum n stays tiny here
    } else if(id==4){
        // shapes: already tidy, nearly tidy, fully interleaved, one colour only
        printf("5\n");
        emitTidy(20000,7);
        emitNearlyTidy(20000,7,50);
        emitInterleaved(20000,20);
        emitRandom(20000,1);          // a single colour - always 0
        emitRandom(20000,2);          // two colours
    } else if(id==5){
        // Two separate things are being stressed here, and they pull apart.
        // The dp cost depends on the number of DISTINCT colours, not on n, so
        // four tiny rows that happen to use all 20 colours already pay the full
        // 2^20 sweep four times over - no length needed.
        // That frees the whole n budget for the last case, which exists to make
        // the answer overflow an int: 2 colours strictly interleaved over
        // 396000 marbles answers 198000 * 197999 / 2 = 19601901000.
        printf("5\n");
        for(int i=0;i<3;i++) emitRandom(100,20);
        emitInterleaved(100,20);
        emitInterleaved(396000,2);
    } else if(id==6){
        // edges: the smallest legal row, colours 1 and 20 at the ends of the
        // range, a row that is one swap away, and a maximal answer
        printf("5\n");
        {vector<int> a={1,1}; emitRow(a);}      // the smallest legal row
        {vector<int> a={20,1}; emitRow(a);}     // both ends of the colour range
        {vector<int> a={1,2,1}; emitRow(a);}    // one swap away
        {vector<int> a={2,1,2,1}; emitRow(a);}
        emitInterleaved(40,20);                 // 20 colours, answer C(20,2) = 190
    }
    return 0;
}
