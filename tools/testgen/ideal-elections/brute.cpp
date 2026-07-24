#include <bits/stdc++.h>
using namespace std;
// Exhaustive: for each voter list every divisor of a_i, iterate the full
// cartesian product of choices, count arrays where lcm(p) == product(p).
// Only for tiny n and tiny a_i.
const long long mod = 1e9 + 7;

long long g(long long a, long long b){ return b ? g(b, a%b) : a; }

int main(){
    int t;
    if(!(cin>>t)) return 0;
    while(t--){
        int n; cin>>n;
        vector<vector<long long>> divs(n);
        for(int i=0;i<n;i++){
            long long x; cin>>x;
            for(long long d=1; d<=x; d++) if(x%d==0) divs[i].push_back(d);
        }
        long long count = 0;
        vector<int> idx(n, 0);
        while(true){
            // evaluate current combination
            unsigned long long prod = 1, lcm = 1;
            for(int i=0;i<n;i++){
                unsigned long long p = divs[i][idx[i]];
                prod *= p;
                lcm = lcm / g(lcm, p) * p;
            }
            if(prod == lcm) count = (count + 1) % mod;
            // advance
            int i = 0;
            for(; i<n; i++){
                if(++idx[i] < (int)divs[i].size()) break;
                idx[i] = 0;
            }
            if(i == n) break;
        }
        cout << count << '\n';
    }
    return 0;
}
