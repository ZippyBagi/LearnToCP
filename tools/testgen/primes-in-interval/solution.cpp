#include <bits/stdc++.h>

using namespace std;

const int MAXN = 1000000;

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    vector<bool> is_prime(MAXN + 1, true);
    is_prime[0] = false;
    is_prime[1] = false; // remember, 1 is not prime!

    for(int i=2;(long long)i*i<=MAXN;i++){
        if(is_prime[i]){
            for(int j=i*i;j<=MAXN;j+=i){
                is_prime[j] = false;
            }
        }
    }

    // prefix counts and prefix sums over the sieve
    vector<int> cnt(MAXN + 1, 0);
    vector<long long> sum(MAXN + 1, 0); // the sum of primes overflows an int

    for(int i=1;i<=MAXN;i++){
        cnt[i] = cnt[i-1] + (is_prime[i] ? 1 : 0);
        sum[i] = sum[i-1] + (is_prime[i] ? i : 0);
    }

    int t;
    cin>>t;

    while(t--){

        int a, b;
        cin>>a>>b;

        cout<<cnt[b] - cnt[a-1]<<' '<<(sum[b] - sum[a-1]) % 1000000<<'\n';
    }
    return 0;
}
