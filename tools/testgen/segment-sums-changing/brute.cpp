// Brute force: keep the plain array and add the range up on every question.
// No tree at all - O(n) per query, so small tests only.
#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; scanf("%d",&t);
    while(t--){
        int n,m; scanf("%d %d",&n,&m);
        vector<int> a(n);
        for(auto &v:a) scanf("%d",&v);
        while(m--){
            char type[4]; scanf("%s",type);
            if(type[0]=='q'){
                int l,r; scanf("%d %d",&l,&r);
                long long s=0;
                for(int i=l;i<=r;i++) s+=a[i];
                printf("%lld\n",s);
            }else{
                int i,v; scanf("%d %d",&i,&v);
                a[i]=v;
            }
        }
    }
    return 0;
}
