#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}
void printArr(vector<long long>&a){for(size_t i=0;i<a.size();i++)printf("%lld%c",a[i],i+1<a.size()?' ':'\n');}
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(2200+id);
    if(id==2){
        int t=1000; printf("%d\n",t);
        for(int i=0;i<t;i++){
            int n=rnd(1,3);
            printf("%d %lld\n",n,rnd(1,20));
            vector<long long>a(n);for(auto&x:a)x=rnd(-20,20);printArr(a);
        }
    } else if(id==3){
        int t=100; printf("%d\n",t);
        for(int i=0;i<t;i++){
            int n=rnd(1,100);
            printf("%d %lld\n",n,rnd(1,500));
            vector<long long>a(n);for(auto&x:a)x=rnd(-1000,1000);printArr(a);
        }
    } else if(id==4){
        printf("5\n");
        vector<long long> a(1000);
        printf("1000 1000000000\n"); for(auto&x:a)x=rnd(-1000000000LL,1000000000LL);printArr(a); // d covers everything, differences overflow an int
        printf("1000 1\n"); for(auto&x:a)x=rnd(-1000000000LL,1000000000LL);printArr(a);          // tiny lamp, houses far apart
        printf("1000 5\n"); for(auto&x:a)x=42;printArr(a);                                       // all houses at the same spot
        printf("1 1000000000\n-1000000000\n");                                                   // single house
        printf("2 1000000000\n-1000000000 1000000000\n");                                        // extreme span, window exactly misses
    } else if(id==5){
        printf("1\n200000 %lld\n",rnd(1,1000000LL));
        vector<long long>a(200000);for(auto&x:a)x=rnd(-100000000LL,100000000LL);printArr(a);
    } else if(id==6){
        // clustered houses - the interesting window is inside one dense cluster
        printf("1\n200000 1000\n");
        vector<long long> a(200000);
        for(auto&x:a){long long c=rnd(0,9)*100000000LL-450000000LL;x=c+rnd(-5000,5000);}
        printArr(a);
    }
    return 0;
}
