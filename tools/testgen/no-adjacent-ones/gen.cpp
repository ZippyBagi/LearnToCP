// gen <test_id> - prints one .in file for the no-adjacent-ones problem to stdout.
//
// The input is a single n, so each test is just one value picked to cover a
// different part of the range:
//   02 - n = 1, the smallest corridor (both "0" and "1" are valid)
//   03 - n = 2, the first n where the rule actually forbids something
//   04 - n = 11, a middle size
//   05 - n = 19, one below the limit
//   06 - n = 20, the limit (17711 arrays)
#include <bits/stdc++.h>

using namespace std;

int main(int argc, char **argv) {
    int id = atoi(argv[1]);

    int n;
    switch (id) {
        case 2:  n = 1;  break;
        case 3:  n = 2;  break;
        case 4:  n = 11; break;
        case 5:  n = 19; break;
        default: n = 20; break;
    }

    printf("%d\n", n);
    return 0;
}
