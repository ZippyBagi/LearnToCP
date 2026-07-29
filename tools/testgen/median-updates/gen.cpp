#include <bits/stdc++.h>
using namespace std;
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    mt19937 rng(918273+id);
    int t,qmax,vmax,mpct;
    if(id==3){ t=5; qmax=40; vmax=20; mpct=50; }
    else if(id==4){ t=4; qmax=3000; vmax=1000000; mpct=40; }
    else if(id==5){ t=2; qmax=100000; vmax=999; mpct=50; }
    else { t=3; qmax=2000; vmax=1000000000; mpct=60; }
    printf("%d\n",t);
    for(int c=0;c<t;c++){
        int q=qmax; printf("%d\n",q);
        printf("d %d\n",(int)(rng()%vmax)+1); // first op must be d
        for(int i=1;i<q;i++){
            if((int)(rng()%100)<mpct) printf("m\n");
            else printf("d %d\n",(int)(rng()%vmax)+1);
        }
    }
}
