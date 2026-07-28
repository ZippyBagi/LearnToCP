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

        vector<long long> cnt(31, 0); // cnt[b] = how many numbers have bit b as their highest one

        for(int i=0;i<n;i++){

            unsigned int x;
            cin>>x;

            int b = 0;
            while((x >> 1) > 0){ // shift away low bits until only the highest one is left
                x >>= 1;
                b++;
            }

            cnt[b]++;
        }

        long long ans = 0;

        for(int b=0;b<31;b++){
            ans += cnt[b] * (cnt[b] - 1) / 2; // every pair inside a group is strong
        }

        cout<<ans<<'\n';
    }
    return 0;
}
