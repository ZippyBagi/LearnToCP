#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; cin>>t;
    while(t--){
        int q; cin>>q; vector<int> v;
        while(q--){
            char op; cin>>op;
            if(op=='i'){ int x; cin>>x; v.push_back(x); }
            else if(op=='e'){ int x; cin>>x; v.erase(find(v.begin(),v.end(),x)); }
            else if(v.empty()) cout<<"-\n";
            else if(op=='m') cout<<*min_element(v.begin(),v.end())<<"\n";
            else cout<<*max_element(v.begin(),v.end())<<"\n";
        }
    }
}
