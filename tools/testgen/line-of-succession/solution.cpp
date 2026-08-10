#include <bits/stdc++.h>
using namespace std;

void dfs(int v, vector<vector<int>>& children, vector<int>& rank_of, int& counter) {

    rank_of[v] = counter;
    counter++;

    for(int i=0;i<children[v].size();i++) { // oldest child first, then all of his line
        dfs(children[v][i], children, rank_of, counter);
    }
}

int main() {
    iostream::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin >> t;

    while(t--) {

        int n;
        cin >> n;

        map<string, int> id;          // a name gets a number the first time we see it
        vector<vector<int>> children; // children[v], oldest first - the order they were read in
        vector<bool> isChild;

        for(int i=0;i<n-1;i++) {

            string a, b;
            cin >> a >> b;

            if(id.count(a) == 0) { id[a] = children.size(); children.push_back(vector<int>()); isChild.push_back(false); }
            if(id.count(b) == 0) { id[b] = children.size(); children.push_back(vector<int>()); isChild.push_back(false); }

            children[id[a]].push_back(id[b]);
            isChild[id[b]] = true; // b has a parent, so b is not the king
        }

        int root = 0;
        for(int v=0;v<n;v++) if(!isChild[v]) root = v; // the one nobody fathered

        vector<int> rank_of(n, 0); // rank_of[v] is v's place in the line of succession
        int counter = 0;

        dfs(root, children, rank_of, counter);

        int q;
        cin >> q;

        for(int i=0;i<q;i++) {

            string name;
            cin >> name;

            cout << name << " " << rank_of[id[name]] << "\n";
        }
    }

    return 0;
}
