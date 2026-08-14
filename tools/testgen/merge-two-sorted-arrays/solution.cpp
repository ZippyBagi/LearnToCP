#include <bits/stdc++.h>

using namespace std;

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        int m, n;
        cin>>m>>n;

        vector<int> a(m), b(n);
        for(int i=0;i<m;i++){
            cin>>a[i];
        }
        for(int j=0;j<n;j++){
            cin>>b[j];
        }

        vector<int> c;
        c.reserve(m + n);

        int i = 0, j = 0;

        while(i < m && j < n){
            if(a[i] <= b[j]){
                c.push_back(a[i]);
                i++;
            }else{
                c.push_back(b[j]);
                j++;
            }
        }

        while(i < m){ // whatever is left of A
            c.push_back(a[i]);
            i++;
        }
        while(j < n){ // ... or of B - only one of these two loops ever runs
            c.push_back(b[j]);
            j++;
        }

        for(int k=0;k<m+n;k++){
            cout<<c[k]<<(k+1 < m+n ? ' ' : '\n');
        }
    }
    return 0;
}
