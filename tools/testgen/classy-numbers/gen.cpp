#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}

const long long LIM = 1000000000000000000LL;

// clamps to the stated 1 <= l <= r <= 10^18, so the straddling cases below can
// be written without worrying about the top of the range
void seg(long long l,long long r){
    if(l < 1) l = 1;
    if(r > LIM) r = LIM;
    if(l > r) l = r;
    printf("%lld %lld\n",l,r);
}

// a random segment with both ends drawn from the same magnitude, so the segment
// is usually short - short segments are where an off-by-one at an end shows up
void randomNear(long long hi){
    long long a=rnd(1,hi), b=rnd(1,hi);
    if(a>b) swap(a,b);
    seg(a,b);
}

// a single number, so the answer is 0 or 1 and every digit boundary gets probed
void single(long long hi){ long long x=rnd(1,hi); seg(x,x); }

int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(9000+id);
    if(id==2){
        // tiny ranges, brute-force checkable end to end
        printf("200\n");
        for(int i=0;i<100;i++) randomNear(2000);
        for(int i=0;i<100;i++) single(2000);
    } else if(id==3){
        // every magnitude from 10^1 up to 10^18
        printf("360\n");
        for(int p=1;p<=18;p++){
            long long hi=1; for(int i=0;i<p;i++) hi*=10;
            for(int i=0;i<10;i++) randomNear(hi);
            for(int i=0;i<10;i++) single(hi);
        }
    } else if(id==4){
        // segments that straddle a power of ten, where the digit count changes
        printf("108\n");
        long long p=1;
        for(int e=0;e<18;e++){
            p*=10;
            seg(p-1,p+1);
            seg(p-1,p);
            seg(p,p+1);
            seg(1,p);
            seg(p,LIM);
            seg(p-1,p*2 <= LIM ? p*2 : LIM);
        }
    } else if(id==5){
        // the full load: 10^4 segments over the whole range
        printf("10000\n");
        for(int i=0;i<5000;i++){
            long long a=rnd(1,LIM), b=rnd(1,LIM);
            if(a>b) swap(a,b);
            seg(a,b);
        }
        for(int i=0;i<3000;i++) single(LIM);
        for(int i=0;i<2000;i++) randomNear(rnd(10,LIM));
    } else if(id==6){
        // edges: the smallest and largest legal values, l = r at both ends, and
        // numbers built to sit exactly on the 3 / 4 non-zero digit boundary
        printf("14\n");
        seg(1,1);
        seg(1,LIM);
        seg(LIM,LIM);
        seg(LIM-1,LIM);
        seg(999999999999999999LL,LIM);   // 18 nines, then 10^18
        seg(1110,1110);                  // exactly 3 non-zero digits
        seg(1111,1111);                  // exactly 4 - not classy
        seg(1111,1111);
        seg(100000000000000000LL,100000000000000000LL); // one non-zero digit
        seg(111000000000000000LL,111000000000000000LL); // three
        seg(111100000000000000LL,111100000000000000LL); // four
        seg(9,10);
        seg(10,11);
        seg(1,9);
    }
    return 0;
}
