// Brute force: build b for every pair (l, r) and count its inversions by the
// definition. O(n^4) - tiny tests only, but it shares no idea with the reference.
#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; scanf("%d",&t);
    while(t--){
        int n; long long k; scanf("%d %lld",&n,&k);
        vector<long long> a(n+1);
        for(int i=1;i<=n;i++) scanf("%lld",&a[i]);
        long long ans=0;
        for(int l=1;l<=n-1;l++){
            for(int r=l+1;r<=n;r++){
                vector<long long> b;
                for(int i=1;i<=l;i++) b.push_back(a[i]);
                for(int i=r;i<=n;i++) b.push_back(a[i]);
                long long c=0;
                for(size_t i=0;i<b.size();i++)
                    for(size_t j=i+1;j<b.size();j++)
                        if(b[i]>b[j]) c++;
                if(c<=k) ans++;
            }
        }
        printf("%lld\n",ans);
    }
    return 0;
}
