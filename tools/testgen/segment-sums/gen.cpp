#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}
void printArr(vector<long long>&a){for(size_t i=0;i<a.size();i++)printf("%lld%c",a[i],i+1<a.size()?' ':'\n');}
void printQueries(int n,int m,bool includeFull){
    printf("%d\n",m);
    for(int i=0;i<m;i++){
        if(includeFull&&i==0){printf("0 %d\n",n-1);continue;}
        int a=rnd(0,n-1),b=rnd(0,n-1);
        if(a>b) swap(a,b);
        printf("%d %d\n",a,b);
    }
}
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(1900+id);
    if(id==2){
        int t=100; printf("%d\n",t);
        for(int i=0;i<t;i++){
            int n=rnd(1,10);printf("%d\n",n);
            vector<long long>a(n);for(auto&x:a)x=rnd(0,100);printArr(a);
            printQueries(n,rnd(1,10),false);
        }
    } else if(id==3){
        int t=10; printf("%d\n",t);
        for(int i=0;i<t;i++){
            int n=rnd(100,1000);printf("%d\n",n);
            vector<long long>a(n);for(auto&x:a)x=rnd(0,100000);printArr(a);
            printQueries(n,rnd(100,1000),true);
        }
    } else if(id==4){
        printf("3\n");
        printf("1\n1000000000\n3\n0 0\n0 0\n0 0\n");                       // single day
        printf("10\n"); {vector<long long>a(10,1000000000LL);printArr(a);} // all maximal
        printf("4\n0 9\n0 0\n9 9\n3 6\n");
        printf("100\n"); {vector<long long>a(100,0);printArr(a);}          // all zero
        printQueries(100,10,true);
    } else if(id==5){
        printf("1\n200000\n");
        vector<long long>a(200000,1000000000LL);                           // maximal values, sums overflow an int
        printArr(a);
        printQueries(200000,50000,true);
    } else if(id==6){
        printf("1\n100000\n");
        vector<long long>a(100000);for(auto&x:a)x=rnd(0,1000000000LL);
        printArr(a);
        printQueries(100000,100000,true);
    }
    return 0;
}
