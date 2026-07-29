#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; cin>>t;
    while(t--){
        int n; cin>>n; vector<long long> a(n); for(auto&x:a)cin>>x;
        int m; cin>>m; vector<long long> b(m); for(auto&x:b)cin>>x;
        sort(a.begin(),a.end()); sort(b.begin(),b.end());
        cout<<(a==b?"YES":"NO")<<"\n";
    }
}
