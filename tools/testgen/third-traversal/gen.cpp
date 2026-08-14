#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}

// A tree on n nodes is built by choosing how many nodes go left; the letters are
// then handed out in inorder, which makes every label distinct automatically.
struct Node{ int left=-1, right=-1; char c=0; };
vector<Node> tree;

int build(int n){
    if(n==0) return -1;
    int id=tree.size();
    tree.push_back(Node());
    int nl=(int)rnd(0,n-1);
    int l=build(nl), r=build(n-nl-1);
    tree[id].left=l; tree[id].right=r;
    return id;
}

int buildShape(int n,int mode){ // 0 left chain, 1 right chain, 2 balanced, 3 zigzag
    if(n==0) return -1;
    int id=tree.size();
    tree.push_back(Node());
    int nl = mode==0 ? n-1 : mode==1 ? 0 : mode==2 ? n/2 : (n%2 ? n-1 : 0);
    int l=buildShape(nl,mode==3?3:mode), r=buildShape(n-nl-1,mode==3?3:mode);
    tree[id].left=l; tree[id].right=r;
    return id;
}

int nextLetter;
void labelInorder(int v){ // inorder labelling keeps every letter distinct
    if(v<0) return;
    labelInorder(tree[v].left);
    tree[v].c='a'+(nextLetter++);
    labelInorder(tree[v].right);
}
void pre(int v,string&s){ if(v<0)return; s+=tree[v].c; pre(tree[v].left,s); pre(tree[v].right,s); }
void ino(int v,string&s){ if(v<0)return; ino(tree[v].left,s); s+=tree[v].c; ino(tree[v].right,s); }

void emit(int root){
    nextLetter=0;
    labelInorder(root);
    string p,i;
    pre(root,p); ino(root,i);
    printf("%s\n%s\n",p.c_str(),i.c_str());
}

void emitRandom(int n){ tree.clear(); emit(build(n)); }
void emitShape(int n,int mode){ tree.clear(); emit(buildShape(n,mode)); }

int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(8200+id);
    if(id==2){
        printf("100\n");
        for(int i=0;i<100;i++) emitRandom((int)rnd(1,4));
    } else if(id==3){
        printf("100\n");
        for(int i=0;i<100;i++) emitRandom((int)rnd(5,26));
    } else if(id==4){
        // the degenerate shapes: chains in both directions, balanced, zigzag
        printf("100\n");
        for(int i=0;i<25;i++) emitShape((int)rnd(1,26),0);
        for(int i=0;i<25;i++) emitShape((int)rnd(1,26),1);
        for(int i=0;i<25;i++) emitShape((int)rnd(1,26),2);
        for(int i=0;i<25;i++) emitShape((int)rnd(1,26),3);
    } else if(id==5){
        printf("100\n");
        for(int i=0;i<100;i++) emitRandom(26); // always the maximum size
    } else if(id==6){
        // edges: a single node, both two-node trees, the full chains, a perfect
        // tree, and the statement example itself
        printf("8\n");
        printf("a\na\n");
        printf("ba\nab\n");   // root b with a left child a
        printf("ab\nab\n");   // root a with a right child b
        emitShape(26,0);
        emitShape(26,1);
        emitShape(15,2);
        emitShape(26,3);
        printf("abecfg\nbeafcg\n");
    }
    return 0;
}
