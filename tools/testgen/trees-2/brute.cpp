// Brute force: the O(n) check from Woodcutter I, plugged into the same binary
// search. Different route to the answer (no sorting, no prefix sums), so it
// cross-checks the suffix arithmetic of the reference solution.
#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; scanf("%d",&t);
    while(t--){
        int n,q; scanf("%d %d",&n,&q);
        vector<long long> a(n);
        for(auto &v:a) scanf("%lld",&v);
        long long mx=*max_element(a.begin(),a.end());
        while(q--){
            long long x; scanf("%lld",&x);
            long long low=0,high=mx,ans=0;
            while(low<=high){
                long long mid=low+(high-low)/2;
                long long s=0;
                for(long long v:a) if(v>mid) s+=v-mid;
                if(s>=x){ ans=mid; low=mid+1; }
                else high=mid-1;
            }
            printf("%lld\n",ans);
        }
    }
    return 0;
}
