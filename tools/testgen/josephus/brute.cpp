// independent simulation with a vector and index arithmetic
#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; scanf("%d",&t);
    while(t--){
        int n,m; scanf("%d %d",&n,&m);
        vector<int> v(n);
        for(int i=0;i<n;i++) v[i]=i;
        int idx=0;
        while(v.size()>1){
            idx=(idx+m-1)%v.size();
            v.erase(v.begin()+idx);
        }
        printf("%d\n",v[0]);
    }
    return 0;
}
