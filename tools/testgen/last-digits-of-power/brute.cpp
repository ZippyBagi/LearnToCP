// independent: multiply one by one (small n only)
#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; scanf("%d",&t);
    while(t--){
        long long a,n,k; scanf("%lld %lld %lld",&a,&n,&k);
        long long m=1;
        for(int i=0;i<k;i++) m*=10;
        long long r=1%m;
        for(long long i=0;i<n;i++) r=r*(a%m)%m;
        char buf[16];
        sprintf(buf,"%0*lld",(int)k,r);
        printf("%s\n",buf);
    }
    return 0;
}
