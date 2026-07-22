#include <bits/stdc++.h>

using namespace std;

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        int n;
        cin>>n;

        long long x;
        cin>>x;

        long long sum = x;  // largest sum of a segment ending at the current element
        long long best = x; // largest sum seen so far

        for(int i=1;i<n;i++){
            cin>>x;
            sum += x;
            if(sum < x){ // the part before x only drags the sum down
                sum = x; // so start fresh from x alone
            }
            if(sum > best){
                best = sum;
            }
        }

        cout<<best<<'\n';
    }
    return 0;
}
