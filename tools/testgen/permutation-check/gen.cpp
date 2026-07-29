#include <bits/stdc++.h>
using namespace std;
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    mt19937_64 rng(313131+id);
    int t,n; long long vmax; int yespct;
    if(id==3){ t=8; n=12; vmax=6; yespct=50; }            // small, many collisions
    else if(id==4){ t=4; n=3000; vmax=1000000; yespct=50; }
    else if(id==5){ t=1; n=100000; vmax=999; yespct=50; } // max size, small values
    else { t=3; n=2000; vmax=1000000000000000000LL; yespct=50; } // 10^18 values
    printf("%d\n",t);
    for(int c=0;c<t;c++){
        vector<long long> a(n);
        for(int i=0;i<n;i++) a[i]=(long long)(rng()%(unsigned long long)vmax)+1;
        vector<long long> b=a;
        shuffle(b.begin(),b.end(),rng);
        bool yes=(int)(rng()%100)<yespct;
        if(!yes){
            int k=rng()%3;
            if(k==0 && n>0) b[rng()%n]=(long long)(rng()%(unsigned long long)vmax)+1; // change one value
            else if(k==1) b.pop_back();                                              // change the length
            else b.push_back((long long)(rng()%(unsigned long long)vmax)+1);
        }
        printf("%d\n",(int)a.size());
        for(size_t i=0;i<a.size();i++) printf("%lld%c",a[i],i+1==a.size()?'\n':' ');
        printf("%d\n",(int)b.size());
        for(size_t i=0;i<b.size();i++) printf("%lld%c",b[i],i+1==b.size()?'\n':' ');
    }
}
