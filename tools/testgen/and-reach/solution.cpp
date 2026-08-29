#include <bits/stdc++.h>

using namespace std;

// the largest k with 2^k <= a
long long power_of_two(long long a){

    long long k = 0;

    while((1LL<<(k+1)) <= a){
        k++;
    }

    return k;
}

// the AND of the range [L, R], read off two blocks of length 2^k.
// They overlap when the length is not a power of two, which is fine - AND does
// not mind seeing the same element twice.
int query(vector<vector<int>>& lookup, int L, int R){

    int len = R - L + 1;
    int k = power_of_two(len);

    return lookup[L][k] & lookup[R - (1<<k) + 1][k];
}

int main(){

    cin.tie(0);
    iostream::sync_with_stdio(false);

    int t;
    cin>>t;

    while(t--){

        int n;
        cin>>n;

        int levels = 1;
        while((1<<levels) <= n){
            levels++;
        }

        vector<vector<int>> lookup(n+1, vector<int>(levels, 0));

        for(int i=0;i<n;i++){
            cin>>lookup[i][0]; // level 0 is the array itself
        }

        for(int j=1;j<levels;j++){
            for(int i=0;i + (1<<j) <= n;i++){
                lookup[i][j] = lookup[i][j-1] & lookup[i + (1<<(j-1))][j-1];
            }
        }

        int q;
        cin>>q;

        while(q--){

            int start, k;
            cin>>start>>k;

            start--; // the input counts positions from 1

            int l = start;
            int r = n - 1;
            int ans = -1;

            while(l <= r){

                int mid = l + (r - l) / 2;

                if(query(lookup, start, mid) >= k){
                    ans = mid;     // this far still holds, try further right
                    l = mid + 1;
                }else{
                    r = mid - 1;
                }
            }

            cout<<(ans == -1 ? -1 : ans + 1);
            cout<<(q > 0 ? ' ' : '\n'); // q is how many questions are left
        }
    }
    return 0;
}
