#include <bits/stdc++.h>
using namespace std;
int main() {
    int t; scanf("%d",&t);
    while(t--) {
        int n; long long d; scanf("%d %lld",&n,&d);
        vector<long long> x(n);
        for(auto &v:x) scanf("%lld",&v);
        sort(x.begin(),x.end());
        int best=0;
        for(int i=0;i<n;i++){
            int c=0;
            for(int j=i;j<n;j++) if(x[j]-x[i]<=2*d) c++;
            best=max(best,c);
        }
        printf("%d\n",best);
    }
    return 0;
}
