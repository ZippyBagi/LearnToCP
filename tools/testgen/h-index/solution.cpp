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

        sort(a.begin(), a.end());
        reverse(a.begin(), a.end()); // largest number of citations first

        int h = 0;
        while(h < n && a[h] >= h + 1){ // the (h+1)-th paper still has at least h+1 citations
            h++;
        }

        cout<<h<<'\n';
    }
    return 0;
}
