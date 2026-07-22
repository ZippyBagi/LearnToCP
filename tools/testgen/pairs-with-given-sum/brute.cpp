#include <bits/stdc++.h>
using namespace std;
int main() {
    int t; scanf("%d",&t);
    while(t--) {
        int n; long long s; scanf("%d %lld",&n,&s);
        vector<long long> a(n);
        for(auto &x:a) scanf("%lld",&x);
        int cnt=0;
        for(int i=0;i<n;i++)
            for(int j=i+1;j<n;j++)
                if(a[i]+a[j]==s) cnt++;
        printf("%d\n",cnt);
    }
    return 0;
}
