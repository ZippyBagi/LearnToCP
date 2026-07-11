// Usage: gen <test_id>
#include <bits/stdc++.h>
using namespace std;
int main(int argc, char** argv){
    int t = atoi(argv[1]);
    mt19937_64 rng(2600 + t);

    if(t == 2){ printf("a\n"); return 0; }              // smallest input, one letter

    if(t == 3){                                         // small: every letter appears at least once
        string s;
        for(char c = 'a'; c <= 'z'; c++) s += c;
        for(int i = 0; i < 74; i++) s += 'a' + rng() % 26;
        shuffle(s.begin(), s.end(), rng);
        printf("%s\n", s.c_str());
        return 0;
    }

    if(t == 4){                                         // max length, a single repeated letter (max count)
        string s(1000000, 'z');
        printf("%s\n", s.c_str());
        return 0;
    }

    // t == 5: max length, random letters
    int n = 1000000;
    string s(n, 'a');
    for(int i = 0; i < n; i++) s[i] = 'a' + rng() % 26;
    printf("%s\n", s.c_str());
    return 0;
}
