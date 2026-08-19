#include <bits/stdc++.h>

using namespace std;

int N, n, r;              // N = how many distinct values, r = start of the suffix
vector<int> a;            // the array, values replaced by their ranks 1..N
vector<int> pref, suff;   // two counting Fenwick trees, indexed by value
long long prefInv, suffInv, crossInv;

void bitAdd(vector<int>& t, int i, int delta){
    for(; i <= N; i += i & -i){
        t[i] += delta;
    }
}

// how many stored values are <= i
long long bitSum(vector<int>& t, int i){
    long long s = 0;
    for(; i > 0; i -= i & -i){
        s += t[i];
    }
    return s;
}

long long countBigger(vector<int>& t, int v){ return bitSum(t, N) - bitSum(t, v); }
long long countSmaller(vector<int>& t, int v){ return bitSum(t, v - 1); }

// a[r] leaves the suffix and the pointer moves on
void dropFromSuffix(){
    suffInv  -= countSmaller(suff, a[r]);  // pairs (r, j) with j > r and a[j] < a[r]
    crossInv -= countBigger(pref, a[r]);   // prefix elements bigger than a[r]
    bitAdd(suff, a[r], -1);
    r++;
}

// a[l] joins the prefix
void addToPrefix(int l){
    prefInv  += countBigger(pref, a[l]);   // prefix elements bigger than a[l]
    crossInv += countSmaller(suff, a[l]);  // suffix elements smaller than a[l]
    bitAdd(pref, a[l], 1);
}

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        long long k;
        cin>>n>>k;

        vector<int> raw(n);
        for(int i=0;i<n;i++){
            cin>>raw[i];
        }

        vector<int> sorted = raw; // coordinate compression - the trees are indexed by value
        sort(sorted.begin(), sorted.end());
        sorted.erase(unique(sorted.begin(), sorted.end()), sorted.end());
        N = sorted.size();

        a = vector<int>(n + 1);
        for(int i=0;i<n;i++){
            a[i+1] = lower_bound(sorted.begin(), sorted.end(), raw[i]) - sorted.begin() + 1;
        }

        pref = vector<int>(N + 1, 0);
        suff = vector<int>(N + 1, 0);

        // the suffix starts as the whole array, so it holds every inversion of a
        suffInv = 0;
        for(int i=n;i>=1;i--){
            suffInv += countSmaller(suff, a[i]);
            bitAdd(suff, a[i], 1);
        }

        prefInv = 0;
        crossInv = 0;
        r = 1;

        long long ans = 0;

        for(int l=1;l<=n-1;l++){

            while(r < l + 1){ // a[l] must leave the suffix before it joins the prefix
                dropFromSuffix();
            }

            addToPrefix(l);

            while(prefInv + suffInv + crossInv > k && r < n){
                dropFromSuffix();
            }

            if(prefInv + suffInv + crossInv <= k){
                ans += n - r + 1; // r works, and so does every position after it
            }
        }

        cout<<ans<<'\n';
    }
    return 0;
}
