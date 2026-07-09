#include <bits/stdc++.h>
using namespace std;
int main(){
    int n; cin >> n;
    vector<long long> a(n);
    for(auto& x : a) cin >> x;
    int bestLen = 0; vector<long long> best;
    for(int mask = 1; mask < (1 << n); mask++){
        vector<long long> s;
        bool ok = true;
        for(int i = 0; i < n; i++) if(mask >> i & 1){
            if(!s.empty() && a[i] <= s.back()){ ok = false; break; }
            s.push_back(a[i]);
        }
        if(!ok) continue;
        if((int)s.size() > bestLen || ((int)s.size() == bestLen && s < best)){
            bestLen = s.size(); best = s;
        }
    }
    cout << bestLen << '\n';
    for(int i = 0; i < bestLen; i++) cout << best[i] << (i+1 < bestLen ? ' ' : '\n');
}
