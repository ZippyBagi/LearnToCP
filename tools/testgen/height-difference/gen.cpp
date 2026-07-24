#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}
void printArr(vector<long long>&a){for(size_t i=0;i<a.size();i++)printf("%lld%c",a[i],i+1<a.size()?' ':'\n');}
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(2300+id);
    if(id==2){
        int t=1000; printf("%d\n",t);
        for(int i=0;i<t;i++){
            int n=rnd(1,4);
            printf("%d %lld\n",n,rnd(1,5));
            vector<long long>a(n);for(auto&x:a)x=rnd(1,10);printArr(a);  // tiny values, lots of duplicates
        }
    } else if(id==3){
        int t=100; printf("%d\n",t);
        for(int i=0;i<t;i++){
            int n=rnd(1,100);
            printf("%d %lld\n",n,rnd(1,50));
            vector<long long>a(n);for(auto&x:a)x=rnd(1,200);printArr(a);
        }
    } else if(id==4){
        printf("5\n");
        vector<long long> a(1000);
        printf("1000 1000000000\n"); for(auto&x:a)x=rnd(1,1000000000LL);printArr(a);  // r at the maximum
        printf("1000 7\n"); for(auto&x:a)x=500;printArr(a);                           // all equal, r > 0, answer 0
        printf("1 5\n77\n");                                                          // single student
        printf("2 999999999\n1 1000000000\n");                                        // extreme pair, exact hit
        printf("1000 3\n"); {for(auto&x:a)x=rnd(1,20);}printArr(a);                   // heavy duplicates, many pairs
    } else if(id==5){
        printf("1\n100000 %lld\n",rnd(1,1000LL));
        vector<long long>a(100000);for(auto&x:a)x=rnd(1,99999LL);printArr(a);          // max-ish n, 5-digit values
    } else if(id==6){
        // answer-extreme: 50000 students of height 7 and 50000 of height 20 -> 2.5*10^9 pairs > INT_MAX
        printf("1\n100000 13\n");
        vector<long long> a;
        for(int i=0;i<50000;i++){a.push_back(7);a.push_back(20);}
        shuffle(a.begin(),a.end(),rng);
        printArr(a);
    }
    return 0;
}
