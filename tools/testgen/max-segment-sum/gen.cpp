#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}
void printArr(vector<long long>&a){for(size_t i=0;i<a.size();i++)printf("%lld%c",a[i],i+1<a.size()?' ':'\n');}
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(1400+id);
    if(id==2){
        int t=1000; printf("%d\n",t);
        for(int i=0;i<t;i++){int n=rnd(1,3);printf("%d\n",n);vector<long long>a(n);for(auto&x:a)x=rnd(-10,10);printArr(a);}
    } else if(id==3){
        int t=50; printf("%d\n",t);
        for(int i=0;i<t;i++){int n=rnd(1,500);printf("%d\n",n);vector<long long>a(n);for(auto&x:a)x=rnd(-10,10);printArr(a);}
    } else if(id==4){
        printf("4\n");
        vector<long long> a(50000);
        printf("50000\n"); for(auto&x:a)x=rnd(-1000000000LL,-1);printArr(a);          // all negative
        printf("50000\n"); for(auto&x:a)x=rnd(1,1000000000LL);printArr(a);            // all positive, huge sum
        printf("1\n-1000000000\n");                                                   // single negative element
        printf("3\n-1 5 -1\n");
    } else if(id==5){
        printf("1\n200000\n");
        vector<long long>a(200000);for(auto&x:a)x=rnd(-1000000000LL,1000000000LL);printArr(a);
    } else if(id==6){
        printf("2\n");
        vector<long long> a(100000);
        printf("100000\n");
        for(int i=0;i<100000;i++)a[i]=(i%2==0)?rnd(500000000LL,1000000000LL):-rnd(1,1000000LL); // big positives, small negatives
        printArr(a);
        printf("100000\n");
        for(int i=0;i<100000;i++)a[i]=(i<50000)?-rnd(1,1000000000LL):rnd(1,1000000000LL);       // best segment is a suffix
        printArr(a);
    }
    return 0;
}
