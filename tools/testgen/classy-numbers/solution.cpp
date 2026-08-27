#include <bits/stdc++.h>

using namespace std;

vector<vector<vector<long long>>> dp;

// how many ways to fill positions pos..end, given cnt non-zero digits used so far
// and whether we are still glued to the prefix of the bound
long long solve(string n, int pos, int tight, int cnt){

    if(cnt > 3){
        return 0;
    }

    if(pos == n.size()){
        return (cnt <= 3);
    }

    if(dp[pos][tight][cnt] != -1){
        return dp[pos][tight][cnt];
    }

    int limit = 9;
    if(tight){
        limit = n[pos] - '0';
    }

    long long ans = 0;

    for(int d=0;d<=limit;d++){
        ans += solve(n, pos+1, tight && d==limit, cnt + (d != 0));
    }

    dp[pos][tight][cnt] = ans;
    return ans;
}

int main(){

    cin.tie(0);
    iostream::sync_with_stdio(false);

    int t;
    cin>>t;

    while(t--){

        long long l, r;
        cin>>l>>r;

        dp = vector<vector<vector<long long>>>(30, vector<vector<long long>>(2, vector<long long>(30, -1)));
        long long left = solve(to_string(max(0LL, l-1)), 0, 1, 0);

        dp = vector<vector<vector<long long>>>(30, vector<vector<long long>>(2, vector<long long>(30, -1)));
        long long right = solve(to_string(r), 0, 1, 0);

        cout<<right - left<<'\n';
    }
    return 0;
}
