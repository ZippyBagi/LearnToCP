#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}

void emitLine(vector<int>&v){
    printf("%d\n",(int)v.size());
    for(size_t k=0;k<v.size();k++) printf("%d%c",v[k],k+1<v.size()?' ':'\n');
}

void emitRandom(int n,long long lo,long long hi){
    vector<int> a(n);
    for(auto &x:a) x=(int)rnd(lo,hi);
    emitLine(a);
}

// almost sorted: a sorted array with a few random swaps, so the answer is small
// but not zero
void emitNearlySorted(int n,int swaps){
    vector<int> a(n);
    for(int i=0;i<n;i++) a[i]=i;
    for(int s=0;s<swaps;s++) swap(a[rnd(0,n-1)],a[rnd(0,n-1)]);
    emitLine(a);
}

void emitDescending(int n){
    vector<int> a(n);
    for(int i=0;i<n;i++) a[i]=n-i;
    emitLine(a);
}

int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(8100+id);
    if(id==2){
        // tiny, with plenty of duplicates so the <= branch gets exercised
        printf("10\n");
        for(int i=0;i<10;i++) emitRandom((int)rnd(1,6),1,5);
    } else if(id==3){
        printf("10\n");
        for(int i=0;i<10;i++) emitRandom((int)rnd(1,500),-1000000000LL,1000000000LL);
    } else if(id==4){
        printf("6\n");
        emitRandom(3000,-1000,1000);
        emitRandom(3000,0,1000000000LL);
        emitNearlySorted(4000,10);
        emitDescending(4000);
        emitRandom(2000,-5,5);      // huge number of ties
        emitNearlySorted(4000,2000);
    } else if(id==5){
        // max n twice. The descending one has 70000 * 69999 / 2 = 2449965000
        // inversions, which is already past INT_MAX, and 5-digit values keep the
        // file small. The random one is n = 10^5 with 3-digit values.
        printf("2\n");
        emitRandom(100000,1,999);
        emitDescending(70000);
    } else if(id==6){
        // edges: one element, all equal, already sorted, exactly one inversion,
        // the two extreme values, negatives
        printf("9\n");
        printf("1\n-1000000000\n");
        printf("1\n1000000000\n");
        printf("5\n7 7 7 7 7\n");
        printf("5\n1 2 3 4 5\n");
        printf("5\n1 2 3 5 4\n");
        printf("2\n1000000000 -1000000000\n");
        printf("2\n-1000000000 1000000000\n");
        printf("6\n-1000000000 1000000000 -1000000000 1000000000 -1000000000 1000000000\n");
        emitDescending(30000); // 449985000 inversions - still inside int, unlike test 05
    }
    return 0;
}
