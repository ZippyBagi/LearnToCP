#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}
void emitCase(int n,int m,long long hi){
    vector<long long> a(n);
    for(auto &x:a) x=rnd(0,hi);
    sort(a.rbegin(),a.rend());
    printf("%d %d\n",n,m);
    for(int i=0;i<n;i++) printf("%lld%c",a[i],i+1<n?' ':'\n');
    for(int i=0;i<m;i++){
        long long p = rnd(0,2)==0 && n>0 ? a[rnd(0,n-1)] : rnd(0,hi); // often exactly at a score
        printf("%lld%c",p,i+1<m?' ':'\n');
    }
}
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(3200+id);
    if(id==2){
        printf("100\n");
        for(int i=0;i<100;i++) emitCase(rnd(1,5),rnd(1,5),20);
    } else if(id==3){
        printf("20\n");
        for(int i=0;i<20;i++) emitCase(rnd(1,500),rnd(1,500),10000);
    } else if(id==4){
        // edges: single score, all equal scores, thresholds 0 and above everything
        printf("3\n");
        printf("1 4\n77\n77 78 0 1000000000\n");
        printf("5 3\n50 50 50 50 50\n50 51 49\n");
        emitCase(1000,1000,3); // heavy duplicates
    } else if(id==5){
        printf("1\n");
        emitCase(100000,50000,1000000); // enough to kill O(n*m); 7-digit scores keep the file small
    }
    return 0;
}
