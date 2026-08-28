#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}

long long woodAt(vector<int>&a,long long h){
    long long s=0;
    for(int v:a) if(v>h) s+=v-h;
    return s;
}

// x is picked so that the answers spread over the whole range of heights:
// half the time we aim at a random saw height, half the time we take x at random.
void emitCase(int n,int hi){
    vector<int> a(n);
    for(auto &v:a) v=(int)rnd(1,hi);
    long long total=0; for(int v:a) total+=v;
    int mx=*max_element(a.begin(),a.end());
    long long x;
    if(rnd(0,1)){
        long long h=rnd(0,mx-1);
        x=woodAt(a,h);
        if(x<1) x=1;
    }else{
        x=rnd(1,total);
    }
    printf("%d %lld\n",n,x);
    for(int i=0;i<n;i++) printf("%d%c",a[i],i+1<n?' ':'\n');
}

int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(7700+id);
    if(id==2){
        printf("10\n");
        for(int i=0;i<10;i++) emitCase((int)rnd(1,5),20);
    } else if(id==3){
        printf("10\n");
        for(int i=0;i<10;i++) emitCase((int)rnd(1,300),10000);
    } else if(id==4){
        printf("8\n");
        for(int i=0;i<8;i++) emitCase((int)rnd(1000,3000),10000);
    } else if(id==5){
        // max n with small heights - kills O(n * H) without blowing up the file
        printf("3\n");
        emitCase(100000,999);
        emitCase(100000,999);
        emitCase(1000,10000);
    } else if(id==6){
        // edges: single tree, all trees equal, x = the whole forest (answer 0),
        // x = 1 (answer one below the tallest), tallest possible heights
        printf("10\n");
        printf("1 1\n1\n");
        printf("1 10000\n10000\n");
        printf("1 1\n10000\n");
        printf("5 1\n10000 10000 10000 10000 10000\n");
        printf("5 50000\n10000 10000 10000 10000 10000\n");
        printf("5 25000\n10000 10000 10000 10000 10000\n");
        printf("4 1\n1 1 1 1\n");
        printf("4 4\n1 1 1 1\n");
        printf("6 10001\n10000 1 10000 1 10000 1\n");
        {   // many equal tall trees, the answer sits one meter under the top
            int n=2000;
            printf("%d 1\n",n);
            for(int i=0;i<n;i++) printf("%d%c",10000,i+1<n?' ':'\n');
        }
    }
    return 0;
}
