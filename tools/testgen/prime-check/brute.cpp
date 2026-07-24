// independent check: deterministic Miller-Rabin
#include <bits/stdc++.h>
using namespace std;
typedef unsigned long long u64;
typedef __uint128_t u128;
u64 mulmod(u64 a,u64 b,u64 m){return (u128)a*b%m;}
u64 powmod(u64 a,u64 b,u64 m){u64 r=1;a%=m;while(b){if(b&1)r=mulmod(r,a,m);a=mulmod(a,a,m);b>>=1;}return r;}
bool isPrime(u64 n){
    if(n<2) return false;
    for(u64 p:{2ULL,3ULL,5ULL,7ULL,11ULL,13ULL,17ULL,19ULL,23ULL,29ULL,31ULL,37ULL}){
        if(n%p==0) return n==p;
    }
    u64 d=n-1; int s=0;
    while(d%2==0){d/=2;s++;}
    for(u64 a:{2ULL,3ULL,5ULL,7ULL,11ULL,13ULL,17ULL,19ULL,23ULL,29ULL,31ULL,37ULL}){
        u64 x=powmod(a,d,n);
        if(x==1||x==n-1) continue;
        bool comp=true;
        for(int i=0;i<s-1;i++){x=mulmod(x,x,n);if(x==n-1){comp=false;break;}}
        if(comp) return false;
    }
    return true;
}
int main(){
    int t; scanf("%d",&t);
    while(t--){
        long long n; scanf("%lld",&n);
        printf("%s\n",isPrime(n)?"YES":"NO");
    }
    return 0;
}
