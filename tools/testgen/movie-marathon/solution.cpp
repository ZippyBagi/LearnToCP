#include <bits/stdc++.h>

using namespace std;

int main(){

    iostream::sync_with_stdio(false);
    cin.tie(0);

    int n;
    cin >> n;

    vector<pair<int,int>> movies(n);

    for(int i = 0; i < n; i++){

        int start, end;
        cin >> start >> end;

        movies[i] = {end, start}; // end goes first, so sorting sorts by end time
    }

    sort(movies.begin(), movies.end());

    int count = 0;
    int current_time = 0;

    for(int i = 0; i < n; i++){

        if(movies[i].second >= current_time){ // the movie starts after we are free

            count++;
            current_time = movies[i].first; // we are busy until it ends
        }
    }

    cout << count;
}
