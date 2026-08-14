#include <bits/stdc++.h>

using namespace std;

string pre, in;

// postorder of the subtree whose preorder starts at pre[preStart] and whose
// inorder is in[inStart .. inStart + n - 1]
string postorder(int preStart, int inStart, int n){

    if(n == 0){
        return ""; // empty subtree
    }

    char root = pre[preStart];
    int m = in.find(root); // every letter is different, so one search over the whole string is safe

    int leftSize = m - inStart;          // everything before the root in the inorder segment
    int rightSize = n - leftSize - 1;    // ... and everything after it

    return postorder(preStart + 1, inStart, leftSize)           // left subtree
         + postorder(preStart + 1 + leftSize, m + 1, rightSize) // right subtree
         + root;                                                // root last
}

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){
        cin>>pre>>in;
        cout<<postorder(0, 0, pre.size())<<'\n';
    }
    return 0;
}
