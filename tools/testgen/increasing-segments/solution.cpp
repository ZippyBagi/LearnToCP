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

        vector<int> a(n);

        for(int i=0;i<n;i++){
            cin>>a[i];
        }

        long long ans = 0; // the number of segments can be huge
        int elements = 1;  // length of the increasing run ending at a[i-1]

        for(int i=1;i<n;i++){
            if(a[i] > a[i-1]){
                ans += elements; // one new segment for every element of the run before a[i]
                elements++;      // the run extends with a[i]
            }else{
                elements = 1;    // the run breaks, a[i] starts a new one
            }
        }

        cout<<ans<<'\n';
    }
    return 0;
}
