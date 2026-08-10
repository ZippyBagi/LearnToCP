// gen <test_id> - prints one .in file for the line-of-succession problem.
// A family is a random rooted tree. The pairs are printed in a shuffled order
// and the king is not printed first, exactly as the statement allows, but the
// children of one parent keep their age order among themselves - that ordering
// is the answer, so it is the one thing the shuffle must not disturb.
#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}

string nameOf(int i){
    // short, distinct, letters only: aa, ab, ... then aaa, aab, ...
    string s;
    int x=i;
    for(int k=0;k<4;k++){ s += char('a' + x%26); x/=26; }
    return s;
}

// one testcase: a family of n people, q queries. shape 0 random, 1 a chain,
// 2 one parent with n-1 children.
void family(int n,int q,int shape){
    printf("%d\n",n);
    vector<int> par(n,-1);
    for(int i=1;i<n;i++){
        if(shape==0) par[i]=rnd(0,i-1);
        else if(shape==1) par[i]=i-1;
        else par[i]=0;
    }
    // pairs listed parent-major so each parent's children keep their age order,
    // then the parents themselves are shuffled
    vector<vector<int>> ch(n);
    for(int i=1;i<n;i++) ch[par[i]].push_back(i);
    vector<int> order;
    for(int v=0;v<n;v++) if(!ch[v].empty()) order.push_back(v);
    for(int i=(int)order.size()-1;i>0;i--) swap(order[i], order[rnd(0,i)]);
    // and the lines of different parents are interleaved, keeping each parent's
    // own children in order
    vector<size_t> at(n,0);
    vector<pair<int,int>> lines;
    bool more=true;
    while(more){
        more=false;
        for(size_t k=0;k<order.size();k++){
            int p=order[k];
            if(at[p]<ch[p].size()){ lines.push_back(make_pair(p,ch[p][at[p]])); at[p]++; more=true; }
        }
    }
    for(size_t i=0;i<lines.size();i++)
        printf("%s %s\n", nameOf(lines[i].first).c_str(), nameOf(lines[i].second).c_str());
    printf("%d\n",q);
    for(int i=0;i<q;i++) printf("%s\n", nameOf(rnd(0,n-1)).c_str());
}

int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(4600+id);

    if(id==2){
        // handcrafted degenerates: the smallest family, the king asked about
        // himself, a pure chain, a single generation, and a case where the
        // king's own line is the very last one in the input.
        printf("5\n");
        printf("2\nking heir\n2\nking\nheir\n");
        printf("3\nking older\nking younger\n3\nking\nolder\nyounger\n");
        printf("4\na king\nb a\nc b\n4\nking\na\nb\nc\n");                 // a chain whose head is on the last line
        printf("5\nking d\nking c\nking b\nking a\n5\nking\na\nb\nc\nd\n");// one generation
        printf("6\nb e\nb d\nking c\nking b\nking a\n6\nking\na\nb\nc\nd\ne\n");
    } else if(id==3){
        // many tiny families - the family cross-checked against brute.cpp
        int T=400; printf("%d\n",T);
        while(T--){ int n=rnd(2,8); family(n, rnd(1,n), rnd(0,2)); }
    } else if(id==4){
        // medium families of all three shapes, still cross-checkable
        int T=40; printf("%d\n",T);
        for(int i=0;i<40;i++){ int n=rnd(10,400); family(n, rnd(1,50), i%3); }
    } else if(id==5){
        // performance and recursion depth: a chain of 50000 generations is the
        // deepest the constraints allow, and the star is the widest.
        printf("3\n");
        family(50000, 10000, 1);
        family(15000, 10000, 2);
        family(15000, 10000, 0);
    } else if(id==6){
        // shape-extreme: a caterpillar (a long spine, every spine member with
        // one extra child) makes the answer jump about instead of climbing, and
        // a broom is a deep stem that opens into many children at the end.
        printf("2\n");
        int n=20000;
        printf("%d\n",n);
        // spine 0, 2, 4, ...  each spine member fathers the next odd number
        // first and then the next spine member, so exactly n-1 pairs are printed
        for(int v=0;v+1<n;v+=2){
            printf("%s %s\n", nameOf(v).c_str(), nameOf(v+1).c_str());
            if(v+2<n) printf("%s %s\n", nameOf(v).c_str(), nameOf(v+2).c_str());
        }
        printf("%d\n", 2000);
        for(int i=0;i<2000;i++) printf("%s\n", nameOf(rnd(0,n-1)).c_str());
        family(20000, 2000, 1);
    }
    return 0;
}
