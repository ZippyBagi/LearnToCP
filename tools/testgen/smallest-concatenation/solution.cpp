#include <bits/stdc++.h>

using namespace std;

bool cmp(const string &x, const string &y){
    return x + y < y + x; // x goes before y exactly when the number xy is smaller than yx
}

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        int n;
        cin>>n;

        vector<string> a(n); // the numbers are kept as strings
        for(int i=0;i<n;i++){
            cin>>a[i];
        }

        sort(a.begin(), a.end(), cmp);

        for(int i=0;i<n;i++){
            cout<<a[i]; // the result is one long number, printed piece by piece
        }
        cout<<'\n';
    }
    return 0;
}
