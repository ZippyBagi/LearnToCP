#include <bits/stdc++.h>

using namespace std;

void hanoi(int n, int from, int to, int spare){

    if(n == 0){ // nothing left to move - the base case
        return;
    }

    hanoi(n - 1, from, spare, to); // clear the n-1 smaller discs out of the way
    cout<<from<<" "<<to<<"\n"; // now the biggest disc is free to move
    hanoi(n - 1, spare, to, from); // and the small ones come back on top of it
}

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        int n;
        cin>>n;

        hanoi(n, 1, 3, 2); // from peg 1 to peg 3, peg 2 is the spare one
    }
    return 0;
}
