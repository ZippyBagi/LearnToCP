// Usage: gen <test_id>
#include <bits/stdc++.h>
using namespace std;
int main(int argc, char** argv){
    int t = atoi(argv[1]);
    mt19937_64 rng(4200 + t);

    if(t == 2){ printf("(\n"); return 0; }              // smallest input, NO
    if(t == 3){ printf(")(\n"); return 0; }             // equal counts but wrong order, NO

    if(t == 4){                                         // random 50/50 string, max length
        int n = 1000000;
        string s(n, '(');
        for(int i = 0; i < n; i++) if(rng() % 2) s[i] = ')';
        printf("%s\n", s.c_str());
        return 0;
    }

    if(t == 5){                                         // max length, deepest possible nesting, YES
        int half = 500000;
        string s = string(half, '(') + string(half, ')');
        printf("%s\n", s.c_str());
        return 0;
    }

    if(t == 6){                                         // max length, random balanced string, YES
        int half = 500000;
        string s;
        s.reserve(2 * half);
        int open = 0, opensLeft = half, closesLeft = half;
        while(opensLeft + closesLeft > 0){
            // choose '(' or ')' at random, but never let the balance go negative
            bool canOpen = opensLeft > 0;
            bool canClose = closesLeft > 0 && open > 0;
            if(canOpen && (!canClose || rng() % 2)){ s += '('; open++; opensLeft--; }
            else { s += ')'; open--; closesLeft--; }
        }
        printf("%s\n", s.c_str());
        return 0;
    }

    // t == 7: balanced until the very last character, then one extra ')' — NO on the final char
    int pairs = 499999;
    string s;
    s.reserve(2 * pairs + 1);
    for(int i = 0; i < pairs; i++) s += "()";
    s += ')';
    printf("%s\n", s.c_str());
    return 0;
}
