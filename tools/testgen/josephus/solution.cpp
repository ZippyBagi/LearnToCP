#include <bits/stdc++.h>

using namespace std;

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        int n, m;
        cin>>n>>m;

        queue<int> q;
        for(int i=0;i<n;i++){
            q.push(i); // the students sit in a circle, 0 is first in line
        }

        while(q.size() > 1){
            for(int i=0;i<m-1;i++){ // the first m-1 students survive this round
                q.push(q.front());  // and move to the back of the line
                q.pop();
            }
            q.pop(); // the m-th student leaves the game
        }

        cout<<q.front()<<'\n';
    }
    return 0;
}
