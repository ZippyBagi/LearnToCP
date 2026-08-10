#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}

int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(5100+id);

    if(id==2){
        // handcrafted degenerates: a single site, no links at all, everybody
        // tied, and self-links on their own - all of them cases where the
        // tie-break rule decides the answer.
        printf("9\n");
        printf("1 0\n");                                  // one site, no links
        printf("1 3\n1 1\n1 1\n1 1\n");                 // one site, only self-links
        printf("2 0\n");                                  // nothing happens, so site 1 wins the tie
        printf("2 1\n1 2\n");                            // the only link decides it
        printf("2 1\n2 1\n");                            // and the other way round
        printf("3 3\n1 2\n2 3\n3 1\n");                 // a cycle - every popularity is 0
        printf("4 4\n2 1\n3 1\n2 4\n3 4\n");           // sites 1 and 4 tie on +2
        printf("5 5\n1 1\n2 2\n3 3\n4 4\n5 5\n");     // nothing but self-links
        printf("100000 0\n");                            // the biggest board, completely empty
    } else if(id==3){
        // many tiny random cases - the family cross-checked against brute.cpp.
        // Small n makes ties and self-links frequent.
        int T=1000; printf("%d\n",T);
        while(T--){
            int n=rnd(1,6), m=rnd(0,12);
            printf("%d %d\n",n,m);
            for(int i=0;i<m;i++) printf("%lld %lld\n",rnd(1,n),rnd(1,n));
        }
    } else if(id==4){
        // medium mixed sizes, still cross-checkable against brute.cpp
        int T=60; printf("%d\n",T);
        while(T--){
            int n=rnd(2,300), m=rnd(0,600);
            printf("%d %d\n",n,m);
            for(int i=0;i<m;i++) printf("%lld %lld\n",rnd(1,n),rnd(1,n));
        }
    } else if(id==5){
        // performance: sum n and sum m at the limit. The naive "for every site,
        // rescan every link" is 10^10 operations here and cannot pass.
        printf("2\n");
        {   int n=100000, m=60000; printf("%d %d\n",n,m);
            for(int i=0;i<m;i++) printf("%lld %lld\n",rnd(1,n),rnd(1,n)); }
        {   int n=40000, m=40000; printf("%d %d\n",n,m);
            // a star: every site links to site 1, so site 1 collects them all
            for(int i=0;i<m;i++) printf("%lld 1\n",rnd(2,n)); }
    } else if(id==6){
        // answer-extreme: one site collects every link (popularity +m), and the
        // mirrored case where site 1 sends every link out (popularity -m).
        // Small n, so the file stays tiny.
        printf("4\n");
        {   int n=2, m=35000; printf("%d %d\n",n,m);
            for(int i=0;i<m;i++) printf("1 2\n"); }        // site 2 reaches +35000
        {   int n=2, m=35000; printf("%d %d\n",n,m);
            for(int i=0;i<m;i++) printf("2 1\n"); }        // site 1 reaches +35000
        {   int n=3, m=25000; printf("%d %d\n",n,m);
            for(int i=0;i<m;i++) printf("%d %d\n", 1+i%3, 1+(i+1)%3); } // a cycle, every popularity 0
        {   int n=4, m=9; printf("%d %d\n",n,m);
            printf("1 2\n1 4\n2 1\n2 2\n2 4\n3 2\n3 4\n4 1\n4 4\n"); }  // the statement case again
    }
    return 0;
}
