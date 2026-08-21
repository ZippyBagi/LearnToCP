#include <bits/stdc++.h>

using namespace std;

const int MOD = 1e9 + 7;

int n, k;
vector<vector<int>> adj;
long long answer;

void addEdge(int u, int v){
    adj[u].push_back(v);
    adj[v].push_back(u);
}

//returns cnt, where cnt[j] is the number of districts of exactly j cities that
//lie inside the subtree of v and contain v itself
vector<long long> dfs(int v, int p){

    vector<long long> cnt(2, 0);
    cnt[1] = 1; //the district that is only v

    for(int i=0;i<adj[v].size();i++){

        int to = adj[v][i];

        if(to == p){ //the only edge leading back is the one we came from
            continue;
        }

        vector<long long> sub = dfs(to, v);

        int lim = min((int)(cnt.size() + sub.size() - 2), k); //nothing above k is ever needed
        vector<long long> nxt(lim + 1, 0);

        for(int a=1;a<cnt.size();a++){

            nxt[a] = (nxt[a] + cnt[a]) % MOD; //take nothing from this child

            for(int b=1;b<sub.size() && a + b <= lim;b++){
                nxt[a+b] = (nxt[a+b] + cnt[a] * sub[b]) % MOD; //glue the two pieces together
            }
        }

        cnt = nxt;
    }

    for(int j=1;j<cnt.size();j++){
        answer = (answer + cnt[j]) % MOD; //every district is counted at its topmost city
    }

    return cnt;
}

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        cin>>n>>k;

        adj = vector<vector<int>>(n + 1); // a fresh tree for every testcase

        for(int i=0;i<n-1;i++){
            int u, v;
            cin>>u>>v;
            addEdge(u, v);
        }

        answer = 0;
        dfs(1, 0); //root the tree at city 1

        cout<<answer<<'\n';
    }
    return 0;
}
