#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; scanf("%d",&t);
    while(t--){
        int n,m; scanf("%d %d",&n,&m);
        vector<int> a(n);
        for(auto &x:a) scanf("%d",&x);
        while(m--){
            int p; scanf("%d",&p);
            int c=0;
            for(int x:a) if(x>=p) c++;
            printf("%d\n",c);
        }
    }
    return 0;
}
