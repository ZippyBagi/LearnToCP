// Brute force: walk every distinct permutation of the digits with
// next_permutation, skip the ones starting with a zero, and test divisibility on
// the number itself. next_permutation already visits each distinct arrangement
// once, so the duplicate-digit rule of the dp is never used here - which is the
// point. Feasible up to about 10 digits.
#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; scanf("%d",&t);
    while(t--){
        long long n,m; scanf("%lld %lld",&n,&m);
        string a = to_string(n);
        sort(a.begin(), a.end());
        long long cnt=0;
        do{
            if(a[0]=='0') continue;
            long long r=0;
            for(char c : a) r = (r*10 + (c-'0')) % m;
            if(r==0) cnt++;
        }while(next_permutation(a.begin(), a.end()));
        printf("%lld\n",cnt);
    }
    return 0;
}
