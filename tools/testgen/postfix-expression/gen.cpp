#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}
const long long LIMIT=1000000000000000000LL; // 10^18
// builds a random postfix expression with the given number of operators,
// keeping every intermediate value below LIMIT
string build(int ops,long long &value){
    if(ops==0){
        long long d=rnd(0,9);
        value=d;
        return string(1,'0'+d);
    }
    int leftOps=rnd(0,ops-1);
    long long lv,rv;
    string l=build(leftOps,lv);
    string r=build(ops-1-leftOps,rv);
    bool canMul = (rv==0 || lv <= LIMIT/max(1LL,rv));
    char op;
    if(canMul && rnd(0,1)==1) op='*';
    else op='+';
    if(op=='*') value=lv*rv; else value=lv+rv;
    if(value>LIMIT){op='+';value=lv+rv;} // sums of two sub-values below 10^18 stay below 2*10^18... keep small ops counts so this is safe
    return l+r+op;
}
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(2800+id);
    long long v;
    if(id==2){
        printf("1000\n");
        for(int i=0;i<1000;i++) printf("%s\n",build(rnd(0,3),v).c_str());
    } else if(id==3){
        printf("500\n");
        for(int i=0;i<500;i++) printf("%s\n",build(rnd(4,20),v).c_str());
    } else if(id==4){
        // edges: single digit, all zeros, long chain of +, chain of 1s and *
        printf("5\n7\n00+0*\n");
        string plus="9";
        for(int i=0;i<49;i++) plus+="9+";
        printf("%s\n",plus.c_str());
        string ones="1";
        for(int i=0;i<49;i++) ones+="1*";
        printf("%s\n",ones.c_str());
        string twos="2";
        for(int i=0;i<58;i++) twos+="2*"; // 2^59 < 10^18
        printf("%s\n",twos.c_str());
    } else if(id==5){
        printf("500\n");
        for(int i=0;i<500;i++) printf("%s\n",build(rnd(30,49),v).c_str());
    }
    return 0;
}
