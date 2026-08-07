// Brute force for morse-sequence, used only for cross-checking.
//
// Builds the signal literally: start with {1}, then keep appending the inverted
// copy of everything built so far, and read the answer off the array. Only
// usable while n stays small (the array doubles every round).
#include <bits/stdc++.h>

using namespace std;

const size_t LIMIT = 1u << 22; // ~4.2 million digits

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(0);

    vector<int> a;
    a.push_back(1);
    while (a.size() < LIMIT) {
        size_t half = a.size();
        for (size_t i = 0; i < half; i++) a.push_back(1 - a[i]);
    }

    int t;
    cin >> t;
    while (t--) {
        unsigned long long n;
        cin >> n;
        if (n > a.size()) {
            cerr << "brute: n = " << n << " is past the built prefix\n";
            return 1;
        }
        cout << a[n - 1] << '\n';
    }
    return 0;
}
