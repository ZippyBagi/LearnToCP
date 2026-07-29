#include <bits/stdc++.h>
using namespace std;

int main() {
    iostream::sync_with_stdio(false);
    cin.tie(0);

    cout << fixed << setprecision(1);

    int t;
    cin >> t;

    while(t--) {

        int q;
        cin >> q;

        priority_queue<int> low;                             // smaller half, biggest on top
        priority_queue<int, vector<int>, greater<int>> high;  // bigger half, smallest on top

        while(q--) {

            char op;
            cin >> op;

            if(op == 'd') {

                int x;
                cin >> x;

                if(low.empty() || x <= low.top()) low.push(x);
                else high.push(x);

                if(low.size() > high.size() + 1) { // low grew too big
                    high.push(low.top());
                    low.pop();
                }
                else if(high.size() > low.size()) { // high may never be the bigger one
                    low.push(high.top());
                    high.pop();
                }
            }
            else {
                if(low.size() == high.size()) cout << (low.top() + high.top()) / 2.0 << "\n";
                else cout << (double)low.top() << "\n";
            }
        }
    }

    return 0;
}
