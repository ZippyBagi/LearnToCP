// Exhaustive O(n^2) pair check for tiny arrays.
#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; scanf("%d",&t);
    while(t--){
        int n; scanf("%d",&n);
        vector<unsigned int> a(n);
        for(auto&x:a) scanf("%u",&x);
        long long ans=0;
        for(int i=0;i<n;i++) for(int j=i+1;j<n;j++) if((a[i]&a[j])>=(a[i]^a[j])) ans++;
        printf("%lld\n",ans);
    }
    return 0;
}
