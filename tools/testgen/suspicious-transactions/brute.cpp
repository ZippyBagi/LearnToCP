#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; cin>>t;
    while(t--){
        int n,d; cin>>n>>d; vector<long long> a(n); for(auto&x:a)cin>>x;
        int w=0;
        for(int i=d;i<n;i++){
            vector<long long> v(a.begin()+i-d,a.begin()+i);
            sort(v.begin(),v.end());
            double med = (d%2) ? (double)v[d/2] : (v[d/2-1]+v[d/2])/2.0;
            if((double)a[i] >= 2.0*med) w++;
        }
        cout<<w<<"\n";
    }
}
