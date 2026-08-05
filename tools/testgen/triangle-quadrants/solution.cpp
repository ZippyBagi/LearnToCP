#include <bits/stdc++.h>

using namespace std;

struct v{

    long long x, y;
};

v add(v a, v b){

    return {a.x + b.x, a.y + b.y};
}

v sub(v a, v b){

    return {a.x - b.x, a.y - b.y};
}

long long cross(v a, v b){

    return (a.x * b.y) - (a.y * b.x);
}

char orientation(v a, v b, v c){ // where is c, relative to the line ab

    long long prod = cross(sub(b, a), sub(c, a));

    if(prod > 0){
        return '+';
    }

    if(prod < 0){
        return '-';
    }

    return '=';
}

// does the triangle p, walked counter-clockwise, reach the quadrant with signs (sx, sy)?
bool reaches(v p[3], long long sx, long long sy){

    // the y axis: the quadrant is on the sx side of it, so it separates the two
    // when the whole triangle sits on the other side. then the same for the x axis
    if(sx * p[0].x <= 0 && sx * p[1].x <= 0 && sx * p[2].x <= 0) return false;
    if(sy * p[0].y <= 0 && sy * p[1].y <= 0 && sy * p[2].y <= 0) return false;

    v origin = {0, 0};
    v alongX = {sx, 0}, alongY = {0, sy}; // the two roads, walked away from the centre

    for(int i = 0; i < 3; i++){

        v a = p[i], b = p[(i + 1) % 3];

        // counter-clockwise, so the triangle is on the '+' side of its own side ab,
        // and this side separates the two when nothing of the quadrant is '+'
        if(orientation(a, b, origin) == '+') continue;
        if(orientation(a, b, add(a, alongX)) == '+') continue;
        if(orientation(a, b, add(a, alongY)) == '+') continue;

        return false;
    }

    return true;
}

int main(){

    iostream::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin >> t;

    while(t--){

        v p[3];
        for(int i = 0; i < 3; i++) cin >> p[i].x >> p[i].y;

        // walk the triangle counter-clockwise, so its inside is always the '+' side
        if(orientation(p[0], p[1], p[2]) == '-') swap(p[1], p[2]);

        cout << (reaches(p,  1,  1) ? '+' : '-')
             << (reaches(p, -1,  1) ? '+' : '-')
             << (reaches(p, -1, -1) ? '+' : '-')
             << (reaches(p,  1, -1) ? '+' : '-') << "\n";
    }

    return 0;
}
