#include <bits/stdc++.h>
using namespace std;
int main() {
    int t; scanf("%d",&t);
    while(t--) {
        int n; long long r; scanf("%d %lld",&n,&r);
        vector<long long> a(n);
        for(auto &x:a) scanf("%lld",&x);
        long long cnt=0;
        for(int i=0;i<n;i++)
            for(int j=i+1;j<n;j++)
                if(llabs(a[i]-a[j])==r) cnt++;
        printf("%lld\n",cnt);
    }
    return 0;
}
