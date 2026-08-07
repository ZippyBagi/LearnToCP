// Reference solution for no-adjacent-ones.
//
// Fill the array one position at a time. A 0 is always allowed; a 1 is allowed
// only when the previous position holds a 0. Trying 0 before 1 at every step
// makes the arrays come out in increasing order.
#include <bits/stdc++.h>

using namespace std;

int n;
int a[25];

void generate(int i) {
    if (i == n) {
        for (int j = 0; j < n; j++) {
            if (j) cout << ' ';
            cout << a[j];
        }
        cout << '\n';
        return;
    }

    a[i] = 0;
    generate(i + 1);

    if (i == 0 || a[i - 1] == 0) {
        a[i] = 1;
        generate(i + 1);
        a[i] = 0;
    }
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(0);

    cin >> n;

    generate(0);

    return 0;
}
