#include <bits/stdc++.h>
using namespace std;

struct v {
    long long x, y;
};

char orientation(v a, v b, v c) {

    // cross product of AB and AC - only its sign matters
    long long prod = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);

    if(prod > 0) return '+';
    if(prod < 0) return '-';
    return '=';
}

bool inBox(v a, v b, v p) {

    return min(a.x, b.x) <= p.x && p.x <= max(a.x, b.x) &&
           min(a.y, b.y) <= p.y && p.y <= max(a.y, b.y);
}

bool intersect(v a, v b, v c, v d) {

    char abc = orientation(a, b, c);
    char abd = orientation(a, b, d);
    char cda = orientation(c, d, a);
    char cdb = orientation(c, d, b);

    if(abc != abd && cda != cdb) return true; // the segments cross properly

    if(abc == '=' && inBox(a, b, c)) return true; // c sits on segment ab
    if(abd == '=' && inBox(a, b, d)) return true;
    if(cda == '=' && inBox(c, d, a)) return true;
    if(cdb == '=' && inBox(c, d, b)) return true;

    return false;
}

int main() {
    iostream::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin >> t;

    while(t--) {

        v a, b, c, d;
        cin >> a.x >> a.y >> b.x >> b.y >> c.x >> c.y >> d.x >> d.y;

        cout << (intersect(a, b, c, d) ? "YES" : "NO") << "\n";
    }

    return 0;
}
