#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(3100+id);
    if(id==2){
        printf("200\n");
        for(int i=0;i<200;i++){
            int n=rnd(1,6);
            printf("%d\n",n);
            for(int j=0;j<n;j++) printf("%lld%c",rnd(1,99),j+1<n?' ':'\n');
        }
    } else if(id==3){
        printf("50\n");
        for(int i=0;i<50;i++){
            int n=rnd(1,7);
            printf("%d\n",n);
            for(int j=0;j<n;j++) printf("%lld%c",rnd(1,1000000000LL),j+1<n?' ':'\n');
        }
    } else if(id==4){
        // tie traps: prefixes of each other (91919 vs 919191), repeated digits, equal numbers
        printf("5\n");
        printf("2\n91919 919191\n");
        printf("3\n9 99 999\n");
        printf("4\n12 121 1212 21\n");
        printf("3\n5 5 5\n");
        printf("2\n1000000000 1\n");
    } else if(id==5){
        printf("1\n50000\n");
        for(int j=0;j<50000;j++) printf("%lld%c",rnd(1,1000000LL),j+1<50000?' ':'\n');
    } else if(id==6){
        // prefix-heavy stress: numbers built from few digits so ties are everywhere
        printf("1\n50000\n");
        for(int j=0;j<50000;j++){
            int len=rnd(1,9);
            string s="";
            for(int k=0;k<len;k++) s+=char('1'+rnd(0,1)); // digits 1 and 2 only
            printf("%s%c",s.c_str(),j+1<50000?' ':'\n');
        }
    }
    return 0;
}
