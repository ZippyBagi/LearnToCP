#include <bits/stdc++.h>

using namespace std;

// how much wood the saw set to h gives, in O(log n)
long long cut(vector<long long>& a, vector<long long>& psum, long long h){
    int idx = lower_bound(a.begin(), a.end(), h) - a.begin(); // first tree at least h tall
    long long total = psum[a.size()] - psum[idx];             // their full height
    return total - h * (long long)(a.size() - idx);           // only the part above h
}

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        int n, q;
        cin>>n>>q;

        vector<long long> a(n);
        for(int i=0;i<n;i++){
            cin>>a[i];
        }

        sort(a.begin(), a.end()); // lower_bound needs a sorted array

        vector<long long> psum(n+1, 0);
        for(int i=0;i<n;i++){
            psum[i+1] = psum[i] + a[i]; // psum[i] = sum of the first i heights
        }

        while(q--){

            long long x;
            cin>>x;

            long long low = 0, high = a[n-1], ans = 0;

            while(low <= high){

                long long mid = low + (high - low) / 2;

                if(cut(a, psum, mid) >= x){
                    ans = mid;      // enough wood - try to raise the saw
                    low = mid + 1;
                }else{
                    high = mid - 1;
                }
            }

            cout<<ans<<'\n';
        }
    }
    return 0;
}
