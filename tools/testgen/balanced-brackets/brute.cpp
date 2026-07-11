// Independent check: repeatedly delete "()" pairs; balanced iff nothing remains.
// O(n^2) — only for small cross-check inputs.
#include <bits/stdc++.h>
using namespace std;
int main(){
    string s;
    cin >> s;
    bool changed = true;
    while(changed){
        changed = false;
        size_t p = s.find("()");
        if(p != string::npos){ s.erase(p, 2); changed = true; }
    }
    cout << (s.empty() ? "YES" : "NO");
}
