#include <bits/stdc++.h>

using namespace std;

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        int n, m;
        cin>>n>>m;

        vector<int> a(n);
        for(int i=0;i<n;i++){
            cin>>a[i]; // sorted from the largest to the smallest
        }

        reverse(a.begin(), a.end()); // lower_bound needs ascending order

        while(m--){
            int p;
            cin>>p;
            int idx = lower_bound(a.begin(), a.end(), p) - a.begin(); // first score >= p
            cout<<n - idx<<'\n'; // everything from there on passes
        }
    }
    return 0;
}
