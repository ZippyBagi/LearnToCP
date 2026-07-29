#include <bits/stdc++.h>
using namespace std;
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    mt19937 rng(556677+id);
    int t,n,vmax,dmode;
    if(id==3){ t=6; n=30; vmax=15; dmode=0; }          // tiny values, many equal
    else if(id==4){ t=4; n=4000; vmax=1000000; dmode=1; }
    else if(id==5){ t=2; n=100000; vmax=500; dmode=1; } // max size, small values
    else { t=3; n=3000; vmax=1000000000; dmode=1; }     // values up to 10^9
    printf("%d\n",t);
    for(int c=0;c<t;c++){
        int d;
        if(dmode==0) d=(int)(rng()%n)+1;
        else if(c==0) d=1;
        else if(c==1) d=n/2;
        else d=(int)(rng()%n)+1;
        printf("%d %d\n",n,d);
        for(int i=0;i<n;i++) printf("%d%c",(int)(rng()%vmax)+1,i+1==n?'\n':' ');
    }
}
