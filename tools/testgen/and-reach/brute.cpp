// Brute force: walk r rightwards from l, folding the AND, and stop as soon as it
// drops below k. No sparse table and no binary search - straight from the
// definition. Fast on random data (the AND collapses to 0 in a few steps), slow
// on the shipped heavy test, which is the point of that test's shape.
#include <bits/stdc++.h>
using namespace std;

int main(){

    int t;
    scanf("%d",&t);

    while(t--){

        int n;
        scanf("%d",&n);

        vector<int> a(n);
        for(int i=0;i<n;i++){
            scanf("%d",&a[i]);
        }

        int q;
        scanf("%d",&q);

        while(q--){

            int l, k;
            scanf("%d %d",&l,&k);
            l--;

            int cur = 0;
            int ans = -1;

            for(int r=l;r<n;r++){

                cur = (r == l) ? a[r] : (cur & a[r]);

                if(cur >= k){
                    ans = r + 1;
                }else{
                    break;
                }
            }

            printf("%d",ans);
            printf("%c", q > 0 ? ' ' : '\n');
        }
    }
    return 0;
}
