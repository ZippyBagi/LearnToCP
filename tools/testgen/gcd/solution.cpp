#include <bits/stdc++.h>

using namespace std;

int gcd(int a, int b){
    while(b != 0){
        int r = a % b;
        a = b;
        b = r;
    }
    return a;
}

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        int a, b, c; // up to 2 * 10^9, which still fits in an int
        cin>>a>>b>>c;

        cout<<gcd(gcd(a, b), c)<<'\n'; // the gcd of three numbers, two at a time
    }
    return 0;
}
