// Brute force: keep the plain array and scan the range on every question.
// No tree at all - O(n) per query, so small tests only.
#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; scanf("%d",&t);
    while(t--){
        int n,q; scanf("%d %d",&n,&q);
        vector<long long> a(n);
        for(auto &v:a) scanf("%lld",&v);
        while(q--){
            char type[4]; scanf("%s",type);
            if(type[0]=='a'){
                int l,r; scanf("%d %d",&l,&r);
                long long best=LLONG_MIN;
                for(int i=l;i<=r;i++) best=max(best,a[i]);
                printf("%lld\n",best);
            }else{
                int i; long long x; scanf("%d %lld",&i,&x);
                a[i]=x;
            }
        }
    }
    return 0;
}
