#include <bits/stdc++.h>
using namespace std;
int main() {
    int t; scanf("%d",&t);
    while(t--) {
        int n; scanf("%d",&n);
        vector<long long> a(n);
        for(auto &x:a) scanf("%lld",&x);
        long long cnt=0;
        for(int i=0;i<n;i++)
            for(int j=i+1;j<n;j++)
                for(int k=j+1;k<n;k++)
                    if(a[i]+a[j]+a[k]==0) cnt++;
        printf("%lld\n",cnt);
    }
    return 0;
}
