// gen <test_id> - prints one .in file for the islands problem to stdout.
// Sizes follow the "keep test files small" rule: n, m <= 200 and the sum of
// n*m over a file stays at or under 10^5.
#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}

void randomGrid(int n,int m,int pct){
    printf("%d %d\n",n,m);
    for(int r=0;r<n;r++){
        for(int c=0;c<m;c++) putchar(rnd(1,100)<=pct?'#':'.');
        putchar('\n');
    }
}

int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(6200+id);

    if(id==2){
        // handcrafted degenerates: the smallest grids, a single row, a single
        // column, an all-water and an all-land grid, and the diagonal traps -
        // cells touching only at a corner are NOT the same island.
        printf("11\n");
        printf("1 1\n.\n");
        printf("1 1\n#\n");
        printf("1 5\n#.#.#\n");
        printf("5 1\n#\n.\n#\n#\n.\n");
        printf("3 3\n...\n...\n...\n");
        printf("3 3\n###\n###\n###\n");
        printf("3 3\n#.#\n.#.\n#.#\n");          // 5 islands of 1 - pure diagonal touching
        printf("4 4\n#..#\n.##.\n.##.\n#..#\n"); // a block of 4 plus 4 corners
        printf("2 2\n#.\n.#\n");
        printf("1 1\n#\n");
        printf("5 5\n#####\n#...#\n#.#.#\n#...#\n#####\n"); // a ring with a dot inside
    } else if(id==3){
        // many tiny random grids - the family cross-checked against brute.cpp
        int T=400; printf("%d\n",T);
        while(T--) randomGrid(rnd(1,6),rnd(1,6),rnd(20,80));
    } else if(id==4){
        // medium random grids at several densities, still cross-checkable
        int T=30; printf("%d\n",T);
        while(T--) randomGrid(rnd(10,40),rnd(10,40),rnd(15,85));
    } else if(id==5){
        // performance: the sum of n*m at the limit, as a few big grids.
        // 45% land is roughly the percolation threshold, so the components are
        // large and irregular - the worst shape for a careless search.
        printf("4\n");
        randomGrid(158,158,45);
        randomGrid(158,158,45);
        randomGrid(158,158,45);
        randomGrid(158,158,45);
    } else if(id==6){
        // answer-extreme: a full 200x200 grid is one island of 40000 (the
        // deepest recursion this problem can ask for), and a checkerboard is
        // the largest possible number of islands, all of size 1.
        printf("3\n");
        printf("200 200\n");
        for(int r=0;r<200;r++){ for(int c=0;c<200;c++) putchar('#'); putchar('\n'); }
        printf("150 150\n");
        for(int r=0;r<150;r++){ for(int c=0;c<150;c++) putchar((r+c)%2?'.':'#'); putchar('\n'); }
        printf("100 100\n");
        for(int r=0;r<100;r++){ for(int c=0;c<100;c++) putchar('.'); putchar('\n'); } // no land at all
    }
    return 0;
}
