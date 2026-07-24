#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}
void printArr(vector<long long>&a){for(size_t i=0;i<a.size();i++)printf("%lld%c",a[i],i+1<a.size()?' ':'\n');}
vector<long long> distinctVals(int n,long long lo,long long hi){
    set<long long> s;
    while((int)s.size()<n) s.insert(rnd(lo,hi));
    vector<long long> v(s.begin(),s.end());
    shuffle(v.begin(),v.end(),rng);
    return v;
}
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(1600+id);
    if(id==2){
        int t=1000; printf("%d\n",t);
        for(int i=0;i<t;i++){int n=rnd(1,4);vector<long long>a=distinctVals(n,0,10);printf("%d %lld\n",n,rnd(0,20));printArr(a);}
    } else if(id==3){
        int t=50; printf("%d\n",t);
        for(int i=0;i<t;i++){int n=rnd(1,200);vector<long long>a=distinctVals(n,0,1000);printf("%d %lld\n",n,rnd(0,2000));printArr(a);}
    } else if(id==4){
        printf("4\n");
        printf("2 1999999999\n1000000000 999999999\n");            // int overflow trap, answer 1
        printf("3 1000000000\n0 500000000 1000000000\n");          // s/2 present once - must not pair with itself
        printf("1 14\n7\n");                                       // single element, no pairs
        printf("100 99\n"); {vector<long long>a(100);for(int i=0;i<100;i++)a[i]=i;shuffle(a.begin(),a.end(),rng);printArr(a);} // 50 pairs
    } else if(id==5){
        int n=100000;                                          // enough to kill O(n^2); small values keep the file small
        vector<long long> a=distinctVals(n,0,1000000);
        printf("1\n%d %lld\n",n,rnd(0,2000000));
        printArr(a);
    } else if(id==6){
        int n=40000;
        vector<long long> a;
        for(int k=0;k<20000;k++){a.push_back(k);a.push_back(1000000000LL-k);} // 20000 pairs with sum 10^9
        shuffle(a.begin(),a.end(),rng);
        printf("1\n%d 1000000000\n",n);
        printArr(a);
    }
    return 0;
}
