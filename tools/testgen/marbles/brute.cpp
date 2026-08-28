// Brute force: try every permutation of the colours that occur, and for each one
// count the swaps by simulating a stable sort of the row - repeatedly bubbling
// with adjacent swaps. No bitmask, no cnt table, no dp: it reaches the answer
// from the definition of the move itself. O(k! * n^2), tiny inputs only.
#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; scanf("%d",&t);
    while(t--){
        int n; scanf("%d",&n);
        vector<int> a(n);
        for(auto &x:a) scanf("%d",&x);
        vector<int> cols(a);
        sort(cols.begin(), cols.end());
        cols.erase(unique(cols.begin(), cols.end()), cols.end());
        sort(cols.begin(), cols.end());
        long long best=LLONG_MAX;
        do{
            vector<int> rank_(21,0);
            for(int i=0;i<(int)cols.size();i++) rank_[cols[i]]=i;
            vector<int> b(n);
            for(int i=0;i<n;i++) b[i]=rank_[a[i]];
            // count adjacent swaps of a stable bubble sort = inversions of b
            long long inv=0;
            for(int i=0;i<n;i++) for(int j=i+1;j<n;j++) if(b[i]>b[j]) inv++;
            best=min(best,inv);
        }while(next_permutation(cols.begin(), cols.end()));
        printf("%lld\n",best);
    }
    return 0;
}
