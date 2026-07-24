// independent: the busiest moment is always at someone's arrival -
// for every arrival count the people present at that time
#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; scanf("%d",&t);
    while(t--){
        int n; scanf("%d",&n);
        vector<long long> a(n),b(n);
        for(int i=0;i<n;i++) scanf("%lld %lld",&a[i],&b[i]);
        int best=0;
        for(int i=0;i<n;i++){
            int c=0;
            for(int j=0;j<n;j++) if(a[j]<=a[i]&&a[i]<b[j]) c++;
            best=max(best,c);
        }
        printf("%d\n",best);
    }
    return 0;
}
