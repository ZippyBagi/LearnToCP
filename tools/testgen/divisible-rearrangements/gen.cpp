#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}

const long long LIM = 999999999999999999LL; // n < 10^18

void one(long long n,long long m){
    if(n < 1) n = 1;
    if(n > LIM) n = LIM;
    printf("%lld %lld\n",n,m);
}

// A uniform m in 1..100 almost always answers 0 - most moduli simply do not
// divide any rearrangement. Weight the draw towards small divisors so the files
// carry a healthy mix of zero and non-zero answers.
long long pickM(){
    static const int easy[] = {2,3,4,6,2,3,4,6,8,12}; // nearly always solvable
    static const int mid[]  = {1,5,9,10,11,15,16,18,20,25};
    long long r = rnd(1,100);
    if(r <= 55) return easy[rnd(0,9)];
    if(r <= 85) return mid[rnd(0,9)];
    return rnd(26,100); // the sparse end, where 0 is the usual answer
}

// a number with exactly d digits, digits drawn from the given alphabet
long long build(int d,const string& alphabet){
    string s;
    do{
        s.clear();
        for(int i=0;i<d;i++) s += alphabet[rnd(0,(int)alphabet.size()-1)];
    }while(s[0]=='0'); // to_string of the value must still have d digits
    return stoll(s);
}

int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(9100+id);
    if(id==2){
        // short numbers, fully brute-force checkable
        printf("5\n");
        for(int i=0;i<5;i++) one(build((int)rnd(1,6),"0123456789"), pickM());
    } else if(id==3){
        // still brute-force checkable, but with heavy digit repetition, which is
        // where the duplicate rule earns its keep
        printf("5\n");
        one(build(8,"12"), pickM());
        one(build(8,"007"), pickM());
        one(build(9,"0123456789"), pickM());
        one(build(9,"55"), pickM());
        one(build(8,"0123"), pickM());
    } else if(id==4){
        // shapes: m = 1 (everything counts), m = 100 (needs the last two digits
        // to land), all digits equal, and a pile of zeros
        printf("5\n");
        one(build(12,"0123456789"), 1);
        one(build(12,"0123456789"), 100);
        one(111111111111LL, 3);
        one(100000000000LL, 8);
        one(build(14,"0000012"), 4);
    } else if(id==5){
        // the full size: 18 digits with m = 100, five times over
        printf("5\n");
        one(build(18,"123456789"), 100);
        one(build(18,"0123456789"), 100);
        one(build(18,"0011"), 8);
        one(build(18,"9"), 9);
        one(build(18,"0123456789"), 6);
    } else if(id==6){
        // edges: the smallest and largest legal n, single digits, numbers whose
        // only rearrangements start with a zero, and m = 1
        printf("5\n");
        one(1,1);
        one(LIM,100);
        one(10,2);           // 10 and 01 - only 10 is legal
        one(100,5);          // 100 only
        one(1000000000000000000LL/10, 5); // 10^17, one 1 and seventeen zeros
    }
    return 0;
}
