#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}
void emitCase(int n,long long hi){
    printf("%d\n",n);
    for(int i=0;i<n;i++) printf("%lld%c",rnd(0,hi),i+1<n?' ':'\n');
}
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(3400+id);
    if(id==2){
        printf("200\n");
        for(int i=0;i<200;i++) emitCase(rnd(1,8),10);
    } else if(id==3){
        printf("50\n");
        for(int i=0;i<50;i++) emitCase(rnd(1,100),rnd(1,200));
    } else if(id==4){
        // edges: all zeros, one paper, everyone has huge citations, h = n exactly
        printf("4\n");
        printf("5\n0 0 0 0 0\n");
        printf("1\n1000000000\n");
        printf("6\n1000000000 1000000000 1000000000 1000000000 1000000000 1000000000\n");
        printf("4\n4 4 4 4\n");
    } else if(id==5){
        printf("1\n");
        emitCase(200000,999); // max n; 3-digit citations keep the file small (h <= 999 anyway)
    } else if(id==6){
        // citations equal to indices - maximum tie-breaking pressure
        int n=100000;
        printf("1\n%d\n",n);
        for(int i=0;i<n;i++) printf("%lld%c",rnd(0,n),i+1<n?' ':'\n');
    }
    return 0;
}
