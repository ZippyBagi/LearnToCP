// independent: for every candidate h count the papers directly
#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; scanf("%d",&t);
    while(t--){
        int n; scanf("%d",&n);
        vector<long long> a(n);
        for(auto &x:a) scanf("%lld",&x);
        int best=0;
        for(int h=0;h<=n;h++){
            int c=0;
            for(long long x:a) if(x>=h) c++;
            if(c>=h) best=h;
        }
        printf("%d\n",best);
    }
    return 0;
}
