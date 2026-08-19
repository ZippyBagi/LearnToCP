#include <bits/stdc++.h>

using namespace std;

int N;             // how many distinct values there are
vector<int> tree;  // counting Fenwick tree, indexed by value

// one more copy of value i has been seen
void addValue(int i){
    for(; i <= N; i += i & -i){
        tree[i]++;
    }
}

// how many of the seen values are <= i
long long countUpTo(int i){
    long long c = 0;
    for(; i > 0; i -= i & -i){
        c += tree[i];
    }
    return c;
}

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        int n;
        cin>>n;

        vector<int> a(n);
        for(int i=0;i<n;i++){
            cin>>a[i];
        }

        // coordinate compression - the tree is indexed by value, and the values
        // themselves go up to 10^9, but there are only n of them
        vector<int> sorted = a;
        sort(sorted.begin(), sorted.end());
        sorted.erase(unique(sorted.begin(), sorted.end()), sorted.end());
        N = sorted.size();

        tree = vector<int>(N + 1, 0); // a fresh tree for every testcase

        long long inversions = 0;

        for(int i=0;i<n;i++){

            int v = lower_bound(sorted.begin(), sorted.end(), a[i]) - sorted.begin() + 1; // rank, 1..N

            inversions += i - countUpTo(v); // i elements seen so far, minus those <= a[i]

            addValue(v);
        }

        cout<<inversions<<'\n';
    }
    return 0;
}
