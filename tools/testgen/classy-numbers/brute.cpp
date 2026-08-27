// Brute force: walk every integer in the segment and count its non-zero digits.
// No dp, no prefix trick. Only usable when the segments are short, so it is run
// on the small test files and on random small inputs.
#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; scanf("%d",&t);
    while(t--){
        long long l,r; scanf("%lld %lld",&l,&r);
        long long c=0;
        for(long long x=l;x<=r;x++){
            int nz=0;
            for(long long y=x;y>0;y/=10) if(y%10) nz++;
            if(nz<=3) c++;
        }
        printf("%lld\n",c);
    }
    return 0;
}
