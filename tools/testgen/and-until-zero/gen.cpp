#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(4200+id);
    if(id==2){
        // tiny values - cheap to cross-check against the brute force
        printf("1000\n");
        for(int i=0;i<1000;i++) printf("%lld\n",rnd(1,100));
    } else if(id==3){
        printf("1000\n");
        for(int i=0;i<1000;i++) printf("%lld\n",rnd(1,1000000000LL));
    } else if(id==4){
        // every power of two and its neighbours - the answer jumps exactly there
        vector<long long> v;
        v.push_back(1); v.push_back(2); v.push_back(3);
        for(int k=0;k<30;k++){
            long long p=1LL<<k;
            if(p<=1000000000LL) v.push_back(p);
            if(p-1>=1) v.push_back(p-1);
            if(p+1<=1000000000LL) v.push_back(p+1);
        }
        v.push_back(999999999LL); v.push_back(1000000000LL);
        printf("%d\n",(int)v.size());
        for(long long x:v) printf("%lld\n",x);
    } else if(id==5){
        // random values pushed right next to a power of two
        printf("1000\n");
        for(int i=0;i<1000;i++){
            int k=rnd(0,29);
            long long p=1LL<<k;
            long long x=p+rnd(0,max(0LL,p-1));
            if(x>1000000000LL) x=1000000000LL;
            printf("%lld\n",x);
        }
    }
    return 0;
}
