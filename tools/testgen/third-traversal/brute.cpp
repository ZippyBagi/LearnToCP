// Brute force: actually build the tree out of nodes, then walk it with a real
// postorder DFS. A different route from the reference, which only slices strings.
#include <bits/stdc++.h>
using namespace std;

string pre, ino;
struct Node{ char c; int l=-1, r=-1; };
vector<Node> nodes;

int build(int preStart,int inStart,int n){
    if(n==0) return -1;
    char root=pre[preStart];
    int m=inStart;
    while(ino[m]!=root) m++;          // linear scan inside the segment
    int leftSize=m-inStart;
    int id=nodes.size();
    nodes.push_back({root,-1,-1});
    int l=build(preStart+1,inStart,leftSize);
    int r=build(preStart+1+leftSize,m+1,n-leftSize-1);
    nodes[id].l=l; nodes[id].r=r;
    return id;
}

void walk(int v,string&out){
    if(v<0) return;
    walk(nodes[v].l,out);
    walk(nodes[v].r,out);
    out+=nodes[v].c;
}

int main(){
    int t; cin>>t;
    while(t--){
        cin>>pre>>ino;
        nodes.clear();
        int root=build(0,0,pre.size());
        string out;
        walk(root,out);
        cout<<out<<"\n";
    }
    return 0;
}
