// Brute force: the lazy solution - concatenate both lists and sort. Reaches the
// answer without ever comparing a[i] to b[j], so it cross-checks the merge and
// especially the leftover loops.
#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; scanf("%d",&t);
    while(t--){
        int m,n; scanf("%d %d",&m,&n);
        vector<int> c(m+n);
        for(auto &v:c) scanf("%d",&v);
        sort(c.begin(),c.end());
        for(int k=0;k<m+n;k++) printf("%d%c",c[k],k+1<m+n?' ':'\n');
    }
    return 0;
}
