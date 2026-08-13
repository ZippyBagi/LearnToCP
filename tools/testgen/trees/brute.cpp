// Brute force: tries every saw height from the top down and stops at the first
// one that already gives enough wood. O(H * n) per testcase - tiny inputs only.
#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; scanf("%d",&t);
    while(t--){
        int n; long long x; scanf("%d %lld",&n,&x);
        vector<int> a(n);
        for(auto &v:a) scanf("%d",&v);
        int mx=*max_element(a.begin(),a.end());
        long long ans=0;
        for(long long h=mx;h>=0;h--){
            long long s=0;
            for(int v:a) if(v>h) s+=v-h;
            if(s>=x){ ans=h; break; }
        }
        printf("%lld\n",ans);
    }
    return 0;
}
