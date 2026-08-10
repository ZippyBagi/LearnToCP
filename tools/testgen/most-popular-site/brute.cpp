// Brute force: store every link and, for each site, rescan the whole list.
// O(n*m) per testcase, used only to cross-check solution.cpp on small inputs.
#include <bits/stdc++.h>
using namespace std;

int main(){
    int t; scanf("%d",&t);
    while(t--){
        int n,m; scanf("%d %d",&n,&m);
        vector<int> a(m), b(m);
        for(int i=0;i<m;i++) scanf("%d %d",&a[i],&b[i]);
        int bestV=1, bestP=INT_MIN;
        for(int v=1;v<=n;v++){
            int in=0,out=0;
            for(int i=0;i<m;i++){
                if(a[i]==b[i]) continue;
                if(b[i]==v) in++;
                if(a[i]==v) out++;
            }
            if(in-out>bestP){ bestP=in-out; bestV=v; }
        }
        printf("%d %d\n",bestV,bestP);
    }
    return 0;
}
