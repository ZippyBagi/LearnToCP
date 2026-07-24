#include <bits/stdc++.h>

using namespace std;

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        long long a, n, k;
        cin>>a>>n>>k;

        long long m = 1;
        for(int i=0;i<k;i++){
            m *= 10; // m = 10^k, keeping the last k digits means working modulo m
        }

        long long res = 1 % m;
        long long base = a % m;

        while(n > 0){
            if(n % 2 == 1){
                res = res * base % m; // the products stay below 10^18, they fit in a long long
            }
            base = base * base % m;
            n /= 2;
        }

        string out = "";
        for(int i=0;i<k;i++){
            out = char('0' + res % 10) + out; // build the digits from the back, zeros included
            res /= 10;
        }

        cout<<out<<'\n';
    }
    return 0;
}
