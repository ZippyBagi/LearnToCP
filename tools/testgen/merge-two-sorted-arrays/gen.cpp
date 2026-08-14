#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}

void emitLine(vector<int>&v){
    for(size_t k=0;k<v.size();k++) printf("%d%c",v[k],k+1<v.size()?' ':'\n');
}

void emitCase(int m,int n,long long hi){
    vector<int> a(m), b(n);
    for(auto &x:a) x=(int)rnd(0,hi);
    for(auto &x:b) x=(int)rnd(0,hi);
    sort(a.begin(),a.end());
    sort(b.begin(),b.end());
    printf("%d %d\n",m,n);
    emitLine(a); emitLine(b);
}

// two blocks that do not overlap at all - one list is emptied before the other
// is touched, which is exactly what the leftover loops exist for
void emitDisjoint(int m,int n,bool aFirst){
    vector<int> a(m), b(n);
    for(auto &x:a) x=(int)rnd(0,1000);
    for(auto &x:b) x=(int)rnd(1001,2000);
    sort(a.begin(),a.end());
    sort(b.begin(),b.end());
    if(!aFirst){ // the high block goes into A instead, sizes follow it
        swap(a,b);
        swap(m,n);
    }
    printf("%d %d\n",m,n);
    emitLine(a); emitLine(b);
}

int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(7900+id);
    if(id==2){
        printf("10\n");
        for(int i=0;i<10;i++) emitCase((int)rnd(1,5),(int)rnd(1,5),20);
    } else if(id==3){
        printf("10\n");
        for(int i=0;i<10;i++) emitCase((int)rnd(1,500),(int)rnd(1,500),1000000000LL);
    } else if(id==4){
        // heavy duplicates, and lists that do not interleave at all
        printf("8\n");
        for(int i=0;i<4;i++) emitCase((int)rnd(2000,4000),(int)rnd(2000,4000),3);
        emitDisjoint(3000,3000,true);
        emitDisjoint(3000,3000,false);
        emitDisjoint(1,5000,true);
        emitDisjoint(5000,1,false);
    } else if(id==5){
        // the size limit: 2 testcases of 25000 + 25000 is the full 10^5 budget.
        // Values stay 6-digit so the file (and its .out) stay under a megabyte.
        printf("2\n");
        emitCase(25000,25000,1000000);
        emitCase(25000,25000,1000000);
    } else if(id==6){
        // edges: one element per list, both lists identical, all values equal,
        // the two extremes 0 and 10^9, and very lopsided sizes
        printf("9\n");
        printf("1 1\n0\n1000000000\n");
        printf("1 1\n1000000000\n0\n");
        printf("1 1\n7\n7\n");
        printf("3 3\n5 5 5\n5 5 5\n");
        printf("2 4\n0 1000000000\n0 0 1000000000 1000000000\n");
        printf("5 1\n1 2 3 4 5\n0\n");
        printf("5 1\n1 2 3 4 5\n6\n");
        emitCase(1,25000,50);
        emitCase(25000,1,50);
    }
    return 0;
}
