#include <bits/stdc++.h>

using namespace std;

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        int n,k;
        cin>>n>>k;

        vector<int> a(n);

        for(int i=0;i<n;i++){
            cin>>a[i];
        }

        sort(a.begin(), a.end());

        int ans = 0;

        int l = 0;
        int r = n-1;

        while(l < r){
            if(a[l] + a[r] == k){
                ans++;
                l++;
                r--;
            }else if(a[l] + a[r] > k){ // the sum is too large
                r--;
            }else if(a[l] + a[r] < k){ // the sum is too small
                l++;
            }
        }
        cout<<ans<<'\n';

    }
    return 0;
}
