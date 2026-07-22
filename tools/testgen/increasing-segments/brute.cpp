#include <bits/stdc++.h>
using namespace std;
int main() {
    int t; scanf("%d",&t);
    while(t--) {
        int n; scanf("%d",&n);
        vector<int> a(n);
        for(auto &x:a) scanf("%d",&x);
        long long cnt=0;
        for(int p=0;p<n;p++)
            for(int q=p+1;q<n;q++){
                if(a[q]>a[q-1]) cnt++;
                else break;
            }
        printf("%lld\n",cnt);
    }
    return 0;
}
