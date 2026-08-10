// gen <test_id> - prints one .in file for the caves problem to stdout.
// A cave is a random tree on n rooms: room i+1 is attached to a uniformly
// chosen earlier room, then the labels are shuffled and each corridor is
// printed in a random direction, so nothing about the input order can be
// assumed. Room 1 is always the entrance, so the shuffle keeps it fixed.
#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}

// prints one testcase: a random tree on n halls, deltas in [-lim, lim].
// Every corridor is printed from the hall closer to the entrance to the one
// further away, which is what the statement guarantees. Only the ORDER of the
// lines is shuffled.
void tree_case(int h,int n,int lim,int shape){
    printf("%d %d\n",h,n);
    vector<int> lab(n+1);
    for(int i=1;i<=n;i++) lab[i]=i;
    for(int i=2;i<=n;i++) swap(lab[i], lab[rnd(2,i)]); // room 1 stays the entrance
    vector<pair<int,int>> e;
    for(int i=2;i<=n;i++){
        int p;
        if(shape==0) p=rnd(1,i-1);   // random tree
        else if(shape==1) p=i-1;     // a single deep path
        else p=1;                    // a star
        e.push_back(make_pair(lab[p],lab[i]));
    }
    for(int i=(int)e.size()-1;i>0;i--) swap(e[i], e[rnd(0,i)]);
    for(size_t i=0;i<e.size();i++){
        printf("%d %d %lld\n", e[i].first, e[i].second, rnd(-lim,lim));
    }
}

int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(7300+id);

    if(id==2){
        // handcrafted degenerates
        printf("6\n");
        printf("0 1\n");                                    // a single room, nowhere to go
        printf("-10000 1\n");                               // the entrance is already the answer
        printf("500 2\n1 2 -1000\n");                       // one corridor, straight down
        printf("-10000 2\n1 2 1000\n");                     // lowest ground, and the only corridor climbs
        printf("100 4\n1 2 7\n2 3 8\n3 4 9\n");             // everything climbs, so the answer is h
        printf("0 5\n1 2 1000\n2 3 1000\n1 4 -1000\n4 5 -1000\n"); // one branch up, one down
    } else if(id==3){
        // many tiny random caves - the family cross-checked against brute.cpp
        int T=800; printf("%d\n",T);
        while(T--) tree_case(rnd(-10000,10000), rnd(1,7), rnd(1,1000), 0);
    } else if(id==4){
        // medium caves of all three shapes, still cross-checkable
        int T=60; printf("%d\n",T);
        for(int i=0;i<60;i++) tree_case(rnd(-10000,10000), rnd(2,300), 1000, i%3);
    } else if(id==5){
        // performance and recursion depth: one path of 50000 rooms, which is
        // the deepest chain of calls the constraints allow, plus a star and a
        // random tree. Deltas are one digit here - the depth is what this file
        // is for, and small values keep it under a megabyte.
        printf("3\n");
        tree_case(0, 50000, 9, 1);   // a path of 50000 rooms
        tree_case(0, 10000, 9, 2);   // a star with 9999 arms
        tree_case(0, 10000, 9, 0);   // a random tree
    } else if(id==6){
        // answer-extreme, on purpose in a small file: the ground at each end of
        // its range and every step at the largest allowed size, so the altitude
        // runs as far from h as a short cave can take it.
        printf("6\n");
        printf("-10000 1\n");
        printf("10000 2\n1 2 -1000\n");
        int n=5000;
        printf("-10000 %d\n",n);
        for(int i=2;i<=n;i++) printf("%d %d -1000\n",i-1,i);   // straight down, answer -5010000
        printf("10000 %d\n",n);
        for(int i=2;i<=n;i++) printf("%d %d 1000\n",i-1,i);    // straight up, answer 10000
        printf("0 %d\n",n);
        for(int i=2;i<=n;i++) printf("%d %d %d\n",i-1,i,(i%2)?1000:-1000); // zigzag
        printf("0 %d\n",n);
        // a broom: a deep stem, then every leaf drops by the maximum step
        for(int i=2;i<=n/2;i++) printf("%d %d -1000\n",i-1,i);
        for(int i=n/2+1;i<=n;i++) printf("%d %d -1000\n",n/2,i);
    }
    return 0;
}
