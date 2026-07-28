#include <bits/stdc++.h>

using namespace std;

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        unsigned int a, b;
        cin>>a>>b;

        cout<<(a ^ b)<<'\n'; // only the bits where a and b differ survive, each paid once
    }
    return 0;
}
