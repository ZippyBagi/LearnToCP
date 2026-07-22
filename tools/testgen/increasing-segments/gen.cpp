#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}
void printArr(vector<long long>&a){for(size_t i=0;i<a.size();i++)printf("%lld%c",a[i],i+1<a.size()?' ':'\n');}
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(1300+id);
    if(id==2){
        int t=1000; printf("%d\n",t);
        for(int i=0;i<t;i++){int n=rnd(2,3);printf("%d\n",n);vector<long long>a(n);for(auto&x:a)x=rnd(-5,5);printArr(a);}
    } else if(id==3){
        int t=50; printf("%d\n",t);
        for(int i=0;i<t;i++){int n=rnd(2,200);printf("%d\n",n);vector<long long>a(n);for(auto&x:a)x=rnd(-100,100);printArr(a);}
    } else if(id==4){
        printf("6\n");
        int n=5000;
        vector<long long> a(n);
        printf("%d\n",n); for(int i=0;i<n;i++)a[i]=i-2500; printArr(a);              // strictly increasing
        printf("%d\n",n); for(int i=0;i<n;i++)a[i]=2500-i; printArr(a);              // strictly decreasing
        printf("%d\n",n); for(int i=0;i<n;i++)a[i]=7; printArr(a);                   // all equal
        printf("%d\n",n); for(int i=0;i<n;i++)a[i]=i%2; printArr(a);                 // alternating 0 1 0 1
        printf("2\n5 5\n");                                                          // smallest n, equal pair
        printf("2\n-1000000000 1000000000\n");                                       // extreme values
    } else if(id==5){
        printf("1\n200000\n");
        vector<long long>a(200000);for(auto&x:a)x=rnd(-1000000000LL,1000000000LL);printArr(a);
    } else if(id==6){
        printf("1\n200000\n");
        vector<long long>a(200000);long long cur=-1000000000LL;
        for(auto&x:a){x=cur;cur+=rnd(1,9000);}                                       // strictly increasing, max answer
        printArr(a);
    }
    return 0;
}
