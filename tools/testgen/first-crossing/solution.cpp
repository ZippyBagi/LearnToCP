#include <bits/stdc++.h>

using namespace std;

int n; // values in the structure: one per cell, plus the sky and the ground
vector<int> parent;
vector<int> sz;
int components;

void createSets(){

    for(int i=0;i<n;i++){
        parent[i] = i; //everybody is their own root
        sz[i] = 1;
    }
}

int find(int x){

    if(parent[x] == x){ //x is a root, so x is the name of its set
        return x;
    }

    parent[x] = find(parent[x]); //path compression

    return parent[x];
}

void unite(int a, int b){

    a = find(a);
    b = find(b);

    if(a == b){ //already together, nothing to do
        return;
    }

    if(sz[a] < sz[b]){ //the smaller tree goes under the bigger one
        swap(a, b);
    }

    parent[b] = a;
    sz[a] += sz[b];

    components--;
}

bool same(int a, int b){
    return find(a) == find(b);
}

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        int side, m;
        cin>>side>>m;

        int SKY = side*side;        // one extra value joined to the whole top row
        int GROUND = side*side + 1; // and one joined to the whole bottom row

        n = side*side + 2;
        parent = vector<int>(n);
        sz = vector<int>(n);
        components = n;
        createSets();

        vector<char> one(side*side, 0); // which cells already hold a 1

        int dr[4] = {-1, 1, 0, 0};
        int dc[4] = {0, 0, -1, 1};

        int answer = -1;

        for(int step=1;step<=m;step++){

            int r, c;
            cin>>r>>c;

            int id = r*side + c;

            one[id] = 1;

            if(r == 0){
                unite(id, SKY);
            }
            if(r == side-1){
                unite(id, GROUND);
            }

            for(int d=0;d<4;d++){
                int nr = r + dr[d];
                int nc = c + dc[d];
                if(nr < 0 || nr >= side || nc < 0 || nc >= side){
                    continue;
                }
                if(one[nr*side + nc]){
                    unite(id, nr*side + nc);
                }
            }

            if(answer == -1 && same(SKY, GROUND)){
                answer = step;
            }
        }

        cout<<answer<<'\n';
    }
    return 0;
}
