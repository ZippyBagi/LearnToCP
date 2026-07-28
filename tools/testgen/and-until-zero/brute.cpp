// Exhaustive check for tiny n: walk k down from n and stop at the first zero.
#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; scanf("%d",&t);
    while(t--){
        unsigned int n; scanf("%u",&n);
        unsigned int cur=n, ans=0;
        for(unsigned int k=n;;k--){
            cur&=k;
            if(cur==0){ans=k;break;}
            if(k==0)break;
        }
        printf("%u\n",ans);
    }
    return 0;
}
