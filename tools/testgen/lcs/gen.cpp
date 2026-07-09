// Usage: gen <test_id>
#include <bits/stdc++.h>
using namespace std;
string randstr(mt19937& rng, int len, char lo, char hi){
    string s(len, 'a');
    for(auto& c : s) c = lo + rng() % (hi - lo + 1);
    return s;
}
int main(int argc, char** argv){
    int t = atoi(argv[1]);
    mt19937 rng(91011 + t);
    if(t == 2){ // small random
        printf("%s\n%s\n", randstr(rng, 12, 'a', 'e').c_str(), randstr(rng, 9, 'a', 'e').c_str());
    } else if(t == 3){ // identical strings, answer = 1000
        string s = randstr(rng, 1000, 'a', 'z');
        printf("%s\n%s\n", s.c_str(), s.c_str());
    } else if(t == 4){ // disjoint alphabets, answer = 0
        printf("%s\n%s\n", randstr(rng, 1000, 'a', 'm').c_str(), randstr(rng, 1000, 'n', 'z').c_str());
    } else { // max size, tiny alphabet (dense dp)
        printf("%s\n%s\n", randstr(rng, 1000, 'a', 'c').c_str(), randstr(rng, 1000, 'a', 'c').c_str());
    }
}
