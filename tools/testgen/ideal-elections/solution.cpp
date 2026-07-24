#include <bits/stdc++.h>

using namespace std;

const int maxN = 500000+10;
const int mod = 1e9 + 7;

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    vector<int> sieve(maxN);

    for(int i=1;i<sieve.size();i++){
        sieve[i] = i;
    }

    for(int i = 2;i*i<=maxN;i++){
        if(sieve[i] == i){
            for(int j=i*i;j<maxN;j+=i){
                if(sieve[j] == j){
                    sieve[j] = i;
                }
            }
        }
    }

    vector<int> a(maxN,0);

    while(t--){

        int n;
        cin>>n;

        vector<int> primes;

        int x;
        for(int i=0;i<n;i++){
            cin>>x;
            while(x > 1){
                int p = sieve[x];

                while(x % p == 0){
                    if(a[p] == 0){
                        primes.push_back(p);
                    }
                    a[p]++;
                    x /= p;
                }
            }
        }

        long long ans = 1;

        for(const auto& x : primes){
            ans = (ans * (1+a[x])) % mod;
            a[x] = 0;
        }

        cout<<ans<<'\n';
    }
    return 0;
}
