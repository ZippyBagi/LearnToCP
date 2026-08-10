// Brute force: no traversal at all. Start with only hall 1 known and keep
// sweeping the corridor list, filling in any hall whose starting hall is
// already known, until nothing changes. O(n^2). Used only to cross-check.
#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; if(scanf("%d",&t)!=1) return 0;
    while(t--){
        int h,n; if(scanf("%d %d",&h,&n)!=2) return 0;
        vector<int> a(n-1>0?n-1:0), b(n-1>0?n-1:0), d(n-1>0?n-1:0);
        for(int i=0;i+1<n;i++) if(scanf("%d %d %d",&a[i],&b[i],&d[i])!=3) return 0;
        vector<int> alt(n+1,0); vector<char> known(n+1,0);
        alt[1]=h; known[1]=1;
        bool ch=true;
        while(ch){ ch=false;
            for(int i=0;i+1<n;i++)
                if(known[a[i]]&&!known[b[i]]){ alt[b[i]]=alt[a[i]]+d[i]; known[b[i]]=1; ch=true; }
        }
        int lo=h; for(int v=1;v<=n;v++) if(known[v]) lo=min(lo,alt[v]);
        printf("%d\n",lo);
    }
    return 0;
}
