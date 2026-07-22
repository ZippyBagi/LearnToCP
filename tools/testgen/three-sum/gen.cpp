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
    rng.seed(1800+id);
    if(id==2){
        int t=100; printf("%d\n",t);
        for(int i=0;i<t;i++){int n=rnd(3,6);vector<long long>a=distinctVals(n,-10,10);printf("%d\n",n);printArr(a);}
    } else if(id==3){
        int t=10; printf("%d\n",t);
        for(int i=0;i<t;i++){int n=rnd(50,150);vector<long long>a=distinctVals(n,-300,300);printf("%d\n",n);printArr(a);}
    } else if(id==4){
        printf("4\n");
        printf("3\n1000000000 -1000000000 0\n");                       // extreme values, answer 1
        printf("3\n1000000000 999999999 -1\n");                        // no team, sums overflow an int
        {
            // 0 and pairs (10^9 - k, -(10^9 - k)): exactly 99 teams, big intermediate sums
            vector<long long> a;
            a.push_back(0);
            for(int k=0;k<99;k++){a.push_back(1000000000LL-k);a.push_back(-(1000000000LL-k));}
            shuffle(a.begin(),a.end(),rng);
            printf("%d\n",(int)a.size());
            printArr(a);
        }
        printf("3\n1 2 4\n");                                          // no team at all
    } else if(id==5){
        int n=5000;
        vector<long long> a=distinctVals(n,-1000000,1000000);
        printf("1\n%d\n",n);
        printArr(a);
    } else if(id==6){
        // consecutive values around zero - the number of teams is maximal
        int n=5000;
        vector<long long> a;
        for(int v=-2500;v<2500;v++) a.push_back(v);
        shuffle(a.begin(),a.end(),rng);
        printf("1\n%d\n",n);
        printArr(a);
    }
    return 0;
}
