#include <bits/stdc++.h>
using namespace std;
int main(){
    cout<<fixed<<setprecision(1);
    int t; cin>>t;
    while(t--){
        int q; cin>>q; vector<long long> v;
        while(q--){
            char op; cin>>op;
            if(op=='d'){ long long x; cin>>x; v.push_back(x); sort(v.begin(),v.end()); }
            else {
                int n=v.size();
                if(n%2) cout<<(double)v[n/2]<<"\n";
                else cout<<(v[n/2-1]+v[n/2])/2.0<<"\n";
            }
        }
    }
}
