// property check: reads the .in and the .out, verifies that factors are prime,
// sorted ascending, and multiply back to n. Prints "OK" per testcase.
#include <bits/stdc++.h>
using namespace std;
bool isPrime(long long n){
    if(n<2) return false;
    for(long long i=2;i*i<=n;i++) if(n%i==0) return false;
    return true;
}
int main(int argc,char**argv){
    ifstream fin(argv[1]), fout(argv[2]);
    int t; fin>>t;
    string line;
    bool ok=true;
    for(int tc=0;tc<t;tc++){
        long long n; fin>>n;
        long long expected=n;
        if(!getline(fout,line)){ok=false;break;}
        istringstream iss(line);
        long long f,prev=1,prod=1;
        while(iss>>f){
            if(!isPrime(f)||f<prev){ok=false;}
            prev=f;
            prod*=f;
        }
        if(prod!=expected) ok=false;
    }
    printf(ok?"ALL OK\n":"MISMATCH\n");
    return 0;
}
