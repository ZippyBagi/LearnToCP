#include <bits/stdc++.h>

using namespace std;

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        int n, x;
        cin>>n>>x;

        vector<int> a(n);
        for(int i=0;i<n;i++){
            cin>>a[i];
        }

        int low = 0;
        int high = *max_element(a.begin(), a.end()); // above the tallest tree nothing gets cut

        int ans = 0;

        while(low <= high){

            int mid = low + (high - low) / 2;

            int cut = 0;
            for(int i=0;i<n;i++){
                if(a[i] > mid){
                    cut += a[i] - mid; // only the part above the blade falls
                }
            }

            if(cut >= x){
                ans = mid;      // enough wood - try to raise the saw
                low = mid + 1;
            }else{
                high = mid - 1;
            }
        }

        cout<<ans<<'\n';
    }
    return 0;
}
