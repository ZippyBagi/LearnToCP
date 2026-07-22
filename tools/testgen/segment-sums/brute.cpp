#include <bits/stdc++.h>
using namespace std;
int main() {
    int t; scanf("%d",&t);
    while(t--) {
        int n; scanf("%d",&n);
        vector<long long> v(n);
        for(auto &x:v) scanf("%lld",&x);
        int m; scanf("%d",&m);
        while(m--){
            int a,b; scanf("%d %d",&a,&b);
            long long s=0;
            for(int i=a;i<=b;i++) s+=v[i];
            printf("%lld\n",s);
        }
    }
    return 0;
}
