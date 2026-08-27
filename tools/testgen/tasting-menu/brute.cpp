// Brute force: try every ordered sequence of m distinct dishes and score it
// directly from the definition. O(n! / (n-m)! * m) - tiny n only, but it shares
// no idea with the dp: no bitmasks, no "last dish" state, no reuse of anything.
#include <bits/stdc++.h>
using namespace std;
int n,m,k;
vector<long long> a;
vector<vector<long long>> adj;
vector<char> used;
long long best;

void rec(int depth,int last,long long score){
    best=max(best,score);
    if(depth==m) return;
    for(int i=0;i<n;i++){
        if(used[i]) continue;
        used[i]=1;
        rec(depth+1,i, score + a[i] + (last<0 ? 0 : adj[last][i]));
        used[i]=0;
    }
}

int main(){
    int t; scanf("%d",&t);
    while(t--){
        scanf("%d %d %d",&n,&m,&k);
        a.assign(n,0);
        for(auto &v:a) scanf("%lld",&v);
        adj.assign(n, vector<long long>(n,0));
        for(int i=0;i<k;i++){ long long x,y,c; scanf("%lld %lld %lld",&x,&y,&c); adj[x-1][y-1]=c; }
        used.assign(n,0);
        best=0;
        rec(0,-1,0);
        printf("%lld\n",best);
    }
    return 0;
}
