// gen <test_id> - prints one .in file for the bus-routes problem to stdout.
// The city is s stops and n lines; each line is a random subset of the stops.
// Sizes follow the "keep test files small" rule - the file that kills the
// stop-to-stop graph has one enormous line, not many big ones.
#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}

// one testcase: n lines over s stops, each line holding between lo and hi stops
void city(int s,int n,int lo,int hi){
    printf("%d %d\n",s,n);
    for(int i=0;i<n;i++){
        int m=rnd(lo,min<long long>(hi,s));
        vector<int> all(s);
        for(int j=0;j<s;j++) all[j]=j+1;
        for(int j=0;j<m;j++) swap(all[j], all[rnd(j,s-1)]); // m distinct stops
        printf("%d",m);
        for(int j=0;j<m;j++) printf(" %d",all[j]);
        printf("\n");
    }
    printf("%lld %lld\n",rnd(1,s),rnd(1,s));
}

int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(8400+id);

    if(id==2){
        // handcrafted degenerates
        printf("8\n");
        printf("1 1\n1 1\n1 1\n");            // one stop, already there
        printf("3 1\n1 2\n1 3\n");            // the only line does not help - answer -1
        printf("3 1\n3 1 2 3\n1 3\n");        // one line covers everything
        printf("4 2\n2 1 2\n2 3 4\n1 4\n");   // two lines that never meet - answer -1
        printf("4 2\n2 1 2\n2 2 4\n1 4\n");   // meeting at stop 2 - answer 2
        printf("5 1\n5 1 2 3 4 5\n5 1\n");    // riding the same line backwards
        printf("2 1\n1 1\n1 1\n");            // a line with a single stop, start = end
        printf("2 1\n1 1\n1 2\n");            // a line with a single stop, unreachable
    } else if(id==3){
        // many tiny cities - the family cross-checked against brute.cpp
        int T=500; printf("%d\n",T);
        while(T--) city(rnd(1,8), rnd(1,5), 1, 4);
    } else if(id==4){
        // medium cities, still cross-checkable
        int T=40; printf("%d\n",T);
        while(T--) city(rnd(5,150), rnd(2,60), 1, 8);
    } else if(id==5){
        // performance. The first case is the one that matters: a single line
        // with 60000 stops. Joining every pair of stops on a line - the obvious
        // way to build the graph - is 3.6 * 10^9 edges here and cannot pass,
        // while riding the line costs 60000.
        printf("3\n");
        {   int s=60000; printf("%d 2\n",s);
            printf("%d",s); for(int i=1;i<=s;i++) printf(" %d",i); printf("\n");
            printf("2 %d 1\n", s);
            printf("1 %d\n", s); }
        city(20000, 3000, 1, 6);
        city(20000, 3000, 1, 6);
    } else if(id==6){
        // answer-extreme: a chain of 20000 lines, line i joining stops i and
        // i+1, so getting from the first stop to the last needs 20000 rides -
        // the longest trip the sum of line lengths allows. The second case is
        // the same chain with one link replaced, so it is -1 only after almost
        // the whole city has been searched.
        int L=20000;
        printf("2\n");
        for(int pass=0;pass<2;pass++){
            printf("%d %d\n", L+1, L);
            for(int i=1;i<=L;i++){
                if(pass==1 && i==L/2) printf("2 1 2\n");    // the broken link
                else printf("2 %d %d\n", i, i+1);
            }
            printf("1 %d\n", L+1);
        }
    }
    return 0;
}
