#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}
void printArr(vector<long long>&a){for(size_t i=0;i<a.size();i++)printf("%lld%c",a[i],i+1<a.size()?' ':'\n');}
vector<long long> sortedDistinct(int n,long long lo,long long hi){
    set<long long> s;
    while((int)s.size()<n) s.insert(rnd(lo,hi));
    return vector<long long>(s.begin(),s.end());
}
void emitCase(int n,int q,long long lo,long long hi,int presentPercent){
    vector<long long> a=sortedDistinct(n,lo,hi);
    printf("%d %d\n",n,q);
    printArr(a);
    vector<long long> qs(q);
    for(auto &x:qs){
        if(rnd(1,100)<=presentPercent) x=a[rnd(0,n-1)];
        else x=rnd(lo,hi);
    }
    printArr(qs);
}
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(2000+id);
    if(id==2){
        int t=100; printf("%d\n",t);
        for(int i=0;i<t;i++) emitCase(rnd(1,5),rnd(1,5),1,20,50);
    } else if(id==3){
        int t=20; printf("%d\n",t);
        for(int i=0;i<t;i++) emitCase(rnd(1,500),rnd(1,500),1,10000,50);
    } else if(id==4){
        printf("5\n");
        printf("1 3\n42\n42 42 41\n");                                 // n = 1, duplicate queries, hit and miss
        printf("2 4\n1 1000000000\n1 1000000000 2 999999999\n");       // extreme values, first and last
        {
            vector<long long> a=sortedDistinct(1000,1,1000000000LL);
            printf("1000 1000\n");printArr(a);
            vector<long long> qs(1000);for(int i=0;i<1000;i++)qs[i]=a[rnd(0,999)]; // every query present
            printArr(qs);
        }
        {
            vector<long long> a=sortedDistinct(1000,1,500000000LL);
            printf("1000 1000\n");printArr(a);
            vector<long long> qs(1000);for(auto&x:qs)x=rnd(500000001LL,1000000000LL); // no query present
            printArr(qs);
        }
        printf("3 3\n5 6 7\n4 8 6\n");
    } else if(id==5){
        printf("1\n");
        emitCase(200000,200000,1,1000000000LL,50);
    }
    return 0;
}
