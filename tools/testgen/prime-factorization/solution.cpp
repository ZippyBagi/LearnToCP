#include <bits/stdc++.h>

using namespace std;

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        int n; // up to 2 * 10^9 still fits in an int
        cin>>n;

        bool first = true;

        for(int d=2;d*d<=n;d++){
            while(n % d == 0){ // print d as many times as it divides n
                if(!first){
                    cout<<' ';
                }
                cout<<d;
                first = false;
                n /= d;
            }
        }

        if(n > 1){ // at most one prime factor larger than sqrt(n) can remain
            if(!first){
                cout<<' ';
            }
            cout<<n;
        }

        cout<<'\n';
    }
    return 0;
}
