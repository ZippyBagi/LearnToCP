// Brute force: the definition itself, every pair i < j. O(n^2) - small tests only.
#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; scanf("%d",&t);
    while(t--){
        int n; scanf("%d",&n);
        vector<int> a(n);
        for(auto &v:a) scanf("%d",&v);
        long long c=0;
        for(int i=0;i<n;i++)
            for(int j=i+1;j<n;j++)
                if(a[i]>a[j]) c++;
        printf("%lld\n",c);
    }
    return 0;
}
