#include <bits/stdc++.h>
using namespace std;

int main() {
    iostream::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin >> t;

    while(t--) {

        int n;
        cin >> n;

        long long ax, ay, bx, by;
        cin >> ax >> ay >> bx >> by;

        int cntLeft = 0, cntRight = 0, cntOn = 0;

        for(int i = 0; i < n; i++) {

            long long x, y;
            cin >> x >> y;

            // cross product of AB and AP - only its sign matters
            long long prod = (bx - ax) * (y - ay) - (by - ay) * (x - ax);

            if(prod > 0) cntLeft++;
            else if(prod < 0) cntRight++;
            else cntOn++;
        }

        cout << cntLeft << " " << cntRight << " " << cntOn << "\n";
    }

    return 0;
}
