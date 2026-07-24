#include <bits/stdc++.h>
using namespace std;
bool isPrime(long long n){
    if(n<2) return false;
    for(long long i=2;i*i<=n;i++) if(n%i==0) return false;
    return true;
}
int main(){
    int t; scanf("%d",&t);
    while(t--){
        int a,b; scanf("%d %d",&a,&b);
        long long c=0,s=0;
        for(int x=a;x<=b;x++) if(isPrime(x)){c++;s+=x;}
        printf("%lld %lld\n",c,s%1000000);
    }
    return 0;
}
