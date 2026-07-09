// Usage: gen <test_id>   (prints the .in file to stdout)
#include <bits/stdc++.h>
using namespace std;
int main(int argc, char** argv){
    int t = atoi(argv[1]);
    mt19937 rng(1234 + t);
    int n, m;
    if(t == 2){ n = 5;  m = 7;  }        // small random
    else if(t == 3){ n = 1; m = 20; }    // single row edge case
    else if(t == 4){ n = 200; m = 137; } // medium, non-square
    else { n = 500; m = 500; }           // max constraints
    printf("%d %d\n", n, m);
    for(int i = 0; i < n; i++){
        for(int j = 0; j < m; j++)
            printf("%d%c", (int)(rng() % 10), j+1 < m ? ' ' : '\n');
    }
}
