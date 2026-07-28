// Exhaustive check for tiny values: try every key x up to 2 * max(a, b) + 2.
#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; scanf("%d",&t);
    while(t--){
        unsigned int a,b; scanf("%u %u",&a,&b);
        unsigned int best=UINT_MAX;
        unsigned int lim=2*max(a,b)+2;
        for(unsigned int x=0;x<=lim;x++) best=min(best,(a^x)+(b^x));
        printf("%u\n",best);
    }
    return 0;
}
