// gen <test_id> - prints one .in file for the snakes-and-ladders problem.
// A board is n squares with a die of k sides and m snakes/ladders. Starts are
// drawn from 1..n-2 without repetition (square 0 and the last square never
// carry one), and targets are any other square, so cycles appear on their own.
#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}

void board(int n,int k,int m){
    if(n<3) m=0;
    if(m>n-2) m=n-2;
    printf("%d %d %d\n",n,k,m);
    vector<int> from(n-2>0?n-2:0);
    for(int i=0;i<(int)from.size();i++) from[i]=i+1;
    for(int i=0;i<m;i++) swap(from[i], from[rnd(i,(long long)from.size()-1)]);
    for(int i=0;i<m;i++){
        int u=from[i], v;
        do { v=rnd(0,n-1); } while(v==u);
        printf("%d %d\n",u,v);
    }
}

int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(9500+id);

    if(id==2){
        // handcrafted degenerates
        printf("10\n");
        printf("2 1 0\n");                       // two squares, one throw
        printf("5 4 0\n");                       // the die reaches the end at once
        printf("10 1 0\n");                      // a one-sided die, so 9 throws
        printf("5 2 2\n1 3\n3 1\n");             // the published second example
        printf("5 1 1\n1 3\n");                  // a ladder that skips ahead
        printf("5 1 1\n3 1\n");                  // a snake back to 1, so the end is cut off
        printf("4 1 1\n1 2\n");                  // 0 -> 1 -> 2 -> 3
        printf("6 1 2\n1 2\n2 1\n");             // a cycle blocking the only route - answer -1
        printf("7 2 3\n1 2\n2 3\n3 1\n");        // a cycle on 1, 2, 3 that the die cannot clear
        printf("7 4 3\n1 2\n2 3\n3 1\n");        // the same cycle, but a bigger die jumps over it
    } else if(id==3){
        // many tiny boards - the family cross-checked against brute.cpp.
        // Small n and plenty of snakes means cycles and dead ends are common.
        int T=1000; printf("%d\n",T);
        while(T--){ int n=rnd(2,9); board(n, rnd(1,n-1), rnd(0,n)); }
    } else if(id==4){
        // medium boards, still cross-checkable
        int T=120; printf("%d\n",T);
        while(T--){ int n=rnd(5,120); board(n, rnd(1,min(6,n-1)), rnd(0,n)); }
    } else if(id==5){
        // performance: the sum of n at the limit with the die as large as it
        // gets, so the search really does look at n*k moves.
        printf("10\n");
        for(int i=0;i<10;i++) board(2000, 1999, 2000);
    } else if(id==6){
        // answer-extreme: the longest possible game (a one-sided die on the
        // biggest board, 1999 throws), a board where every route is poisoned by
        // cycles, and a long chain of ladders that ends in a cycle - so the
        // chain must be followed all the way before the square can be judged.
        printf("3\n");
        printf("2000 1 0\n");
        printf("2000 1 1998\n");
        for(int v=1;v<=1998;v++) printf("%d %d\n", v, v==1998 ? 1 : v+1); // one huge cycle
        printf("2000 2 1997\n");
        for(int v=1;v<=1997;v++) printf("%d %d\n", v, v+1); // a chain ending on 1998, no cycle
    }
    return 0;
}
