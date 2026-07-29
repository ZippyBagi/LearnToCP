#include <bits/stdc++.h>
using namespace std;

int main() {
    iostream::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin >> t;

    while(t--) {

        int q;
        cin >> q;

        multiset<int> hall;

        while(q--) {

            char op;
            cin >> op;

            if(op == 'i') {
                int x;
                cin >> x;
                hall.insert(x);
            }
            else if(op == 'e') {
                int x;
                cin >> x;
                hall.erase(hall.find(x)); // find first, so only one copy leaves
            }
            else if(hall.empty()) cout << "-" << "\n";
            else if(op == 'm') cout << *hall.begin() << "\n";  // the smallest
            else cout << *hall.rbegin() << "\n";               // the largest
        }
    }

    return 0;
}
