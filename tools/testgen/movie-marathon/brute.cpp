// Exhaustive check for tiny n: tries every subset of movies.
#include <bits/stdc++.h>
using namespace std;
int main(){
    int n;
    cin >> n;
    vector<long long> a(n), b(n);
    for(int i = 0; i < n; i++) cin >> a[i] >> b[i];
    int best = 0;
    for(int mask = 0; mask < (1 << n); mask++){
        vector<pair<long long,long long>> chosen;
        for(int i = 0; i < n; i++)
            if(mask & (1 << i)) chosen.push_back({a[i], b[i]});
        sort(chosen.begin(), chosen.end());
        bool ok = true;
        for(int i = 1; i < (int)chosen.size(); i++)
            if(chosen[i].first < chosen[i-1].second) ok = false; // touching is allowed
        if(ok) best = max(best, (int)chosen.size());
    }
    cout << best;
}
