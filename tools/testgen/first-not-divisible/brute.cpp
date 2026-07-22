#include <bits/stdc++.h>
using namespace std;
int main() {
    int t; scanf("%d",&t);
    while(t--) {
        int n,q; scanf("%d %d",&n,&q);
        vector<long long> a(n);
        for(auto &x:a) scanf("%lld",&x);
        while(q--){
            long long d; scanf("%lld",&d);
            long long cnt=0;
            for(int i=0;i<n;i++) if(a[i]%d==0) cnt++; // counts ALL divisible - catches generator bugs
            printf("%lld\n",cnt);
        }
    }
    return 0;
}
