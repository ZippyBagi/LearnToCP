// Independent (non-recursive) reference for towers-of-hanoi, used only for
// cross-checking. It does not know the recursive construction at all: it does a
// BFS over the whole state space (every disc sits on one of three pegs, encoded
// base 3) from the starting state to the finishing state and prints the moves of
// a shortest path. That checks both legality and minimality of solution.cpp.
// Exponential in states (3^n), so only usable for small n.
#include <bits/stdc++.h>

using namespace std;

int n;

// state: peg of disc 1 (smallest) in digit 0, disc 2 in digit 1, ...
int pegOf(int state, int disc){
    while(disc--) state /= 3;
    return state % 3;
}

int setPeg(int state, int disc, int peg){
    int pw = 1;
    for(int i=0;i<disc;i++) pw *= 3;
    return state + (peg - pegOf(state, disc)) * pw;
}

// the smallest disc currently on a peg, or n if the peg is empty
int topDisc(int state, int peg){
    for(int d=0;d<n;d++){
        if(pegOf(state, d) == peg) return d;
    }
    return n;
}

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        cin>>n;

        int total = 1;
        for(int i=0;i<n;i++) total *= 3;

        int start = 0;            // every disc on peg 0
        int finish = total - 1;   // every disc on peg 2
        for(int i=0;i<n;i++) start = setPeg(start, i, 0);

        vector<int> prevState(total, -1), prevFrom(total, -1), prevTo(total, -1);
        vector<char> seen(total, 0);

        queue<int> q;
        q.push(start);
        seen[start] = 1;

        while(!q.empty()){
            int cur = q.front();
            q.pop();
            if(cur == finish) break;
            for(int from=0;from<3;from++){
                int d = topDisc(cur, from);
                if(d == n) continue; // empty peg, nothing to take
                for(int to=0;to<3;to++){
                    if(to == from) continue;
                    if(topDisc(cur, to) < d) continue; // cannot put a disc on a smaller one
                    int nxt = setPeg(cur, d, to);
                    if(seen[nxt]) continue;
                    seen[nxt] = 1;
                    prevState[nxt] = cur;
                    prevFrom[nxt] = from;
                    prevTo[nxt] = to;
                    q.push(nxt);
                }
            }
        }

        vector<pair<int,int>> path;
        for(int s=finish; s!=start; s=prevState[s]){
            path.push_back({prevFrom[s], prevTo[s]});
        }
        reverse(path.begin(), path.end());

        for(auto &m : path){
            cout<<m.first + 1<<" "<<m.second + 1<<"\n";
        }
    }
    return 0;
}
