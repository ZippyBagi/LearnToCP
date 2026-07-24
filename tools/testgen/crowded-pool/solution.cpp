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

        vector<pair<int,int>> events; // (time, +1) is an arrival, (time, -1) a departure

        for(int i=0;i<n;i++){
            int a, b;
            cin>>a>>b;
            events.push_back({a, +1});
            events.push_back({b, -1});
        }

        sort(events.begin(), events.end()); // equal times: -1 sorts before +1, departures go first

        int cur = 0, best = 0;

        for(auto e : events){
            cur += e.second; // one person more or less at the pool
            best = max(best, cur);
        }

        cout<<best<<'\n';
    }
    return 0;
}
