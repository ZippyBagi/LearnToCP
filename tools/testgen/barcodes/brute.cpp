#include <bits/stdc++.h>
using namespace std;
int main() {
    int t; scanf("%d",&t);
    while(t--) {
        int n,q; scanf("%d %d",&n,&q);
        vector<int> a(n);
        for(auto &x:a) scanf("%d",&x);
        int cnt=0;
        while(q--){
            int k; scanf("%d",&k);
            for(int i=0;i<n;i++) if(a[i]==k){cnt++;break;}
        }
        printf("%d\n",cnt);
    }
    return 0;
}
