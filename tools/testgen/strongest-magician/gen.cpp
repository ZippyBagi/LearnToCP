#include <bits/stdc++.h>
using namespace std;
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    mt19937 rng(717171+id);
    int t,q,vmax;
    if(id==3){ t=6; q=25; vmax=4; }              // tiny strength range: lots of duplicates
    else if(id==4){ t=4; q=3000; vmax=1000; }
    else if(id==5){ t=2; q=100000; vmax=999; }   // max size, small values
    else { t=3; q=2000; vmax=999999999; }        // strengths just under 10^9
    printf("%d\n",t);
    for(int c=0;c<t;c++){
        printf("%d\n",q);
        vector<int> present;
        for(int i=0;i<q;i++){
            int r=rng()%100;
            if(r<45){
                int x=(int)(rng()%vmax)+1;
                present.push_back(x);
                printf("i %d\n",x);
            }
            else if(r<70 && !present.empty()){
                int k=rng()%present.size();
                printf("e %d\n",present[k]);
                present[k]=present.back();
                present.pop_back();
            }
            else printf("%c\n", rng()%2 ? 'm' : 'M'); // queries, sometimes on an empty hall
        }
    }
}
