#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}

void emit(int s, vector<pair<int,int>>& cells){
    printf("%d %d\n",s,(int)cells.size());
    for(auto &p:cells) printf("%d %d\n",p.first,p.second);
}

// every cell once, in random order - percolation happens somewhere in the middle
void emitShuffled(int s){
    vector<pair<int,int>> c;
    for(int r=0;r<s;r++) for(int j=0;j<s;j++) c.push_back({r,j});
    shuffle(c.begin(),c.end(),rng);
    emit(s,c);
}

// a random prefix of the shuffle, so it often never connects at all
void emitPartial(int s,int m){
    vector<pair<int,int>> c;
    for(int r=0;r<s;r++) for(int j=0;j<s;j++) c.push_back({r,j});
    shuffle(c.begin(),c.end(),rng);
    c.resize(min((size_t)m,c.size()));
    emit(s,c);
}

// Everything except one row, then that row last. This is the shape that hurts a
// solution which re-searches after every write: the answer only arrives at the
// very end, so the search runs m times over a nearly full grid.
// Passing keepGap = true drops the last row entirely, so the answer is -1 and
// the re-search never gets to stop early either.
void emitBlockedRow(int s,bool keepGap){
    int gap = s/2;
    vector<pair<int,int>> c;
    for(int r=0;r<s;r++) for(int j=0;j<s;j++) if(r!=gap) c.push_back({r,j});
    shuffle(c.begin(),c.end(),rng);
    if(!keepGap){
        vector<pair<int,int>> last;
        for(int j=0;j<s;j++) last.push_back({gap,j});
        shuffle(last.begin(),last.end(),rng);
        for(auto &p:last) c.push_back(p);
    }
    emit(s,c);
}

// a straight vertical line down one column - connects on the very last write
void emitColumn(int s){
    vector<pair<int,int>> c;
    int col=(int)rnd(0,s-1);
    for(int r=0;r<s;r++) c.push_back({r,col});
    emit(s,c);
}

int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(9300+id);
    if(id==2){
        // tiny grids, brute-force checkable, a mix of connecting and not
        printf("10\n");
        for(int i=0;i<5;i++) emitShuffled((int)rnd(1,4));
        for(int i=0;i<5;i++){ int s=(int)rnd(1,4); emitPartial(s,(int)rnd(1,s*s)); }
    } else if(id==3){
        printf("8\n");
        for(int i=0;i<4;i++) emitShuffled((int)rnd(5,20));
        for(int i=0;i<4;i++){ int s=(int)rnd(5,20); emitPartial(s,(int)rnd(1,s*s)); }
    } else if(id==4){
        // shapes: a bare column, a blocked row that never opens, and the same
        // one opened at the very end
        printf("6\n");
        emitColumn(60);
        emitColumn(1);
        emitBlockedRow(60,true);
        emitBlockedRow(60,false);
        emitShuffled(60);
        emitPartial(60,60*60/2);
    } else if(id==5){
        // the heavy pair: both blocked-row shapes at full size, which is where a
        // re-search per write costs about 3 s each
        printf("2\n");
        emitBlockedRow(200,false);
        emitBlockedRow(200,true);
    } else if(id==6){
        // edges: the smallest grid, a two-row grid, a gap that is never bridged,
        // a column built from the middle outwards, and a diagonal that never touches
        printf("6\n");
        {vector<pair<int,int>> c={{0,0}}; emit(1,c);}                     // n = 1 -> 1
        {vector<pair<int,int>> c={{0,0},{1,0}}; emit(2,c);}               // connects at step 2
        {vector<pair<int,int>> c={{0,0},{1,1}}; emit(2,c);}               // diagonal -> -1
        {vector<pair<int,int>> c={{0,0},{0,1},{2,0},{2,1}}; emit(3,c);}   // gap in the middle -> -1
        {vector<pair<int,int>> c={{1,1},{0,1},{2,1}}; emit(3,c);}         // built middle out
        {vector<pair<int,int>> c={{2,2},{1,2},{0,2},{0,0}}; emit(3,c);}   // connects at step 3
    }
    return 0;
}
