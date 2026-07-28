#include <bits/stdc++.h>

using namespace std;

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        unsigned int n;
        cin>>n;

        unsigned int h = 1;

        while((h << 1) <= n){ // h climbs to the largest power of two that is still <= n
            h <<= 1;
        }

        cout<<(h - 1)<<'\n';  // one step below that power of two, all lower bits set
    }
    return 0;
}
