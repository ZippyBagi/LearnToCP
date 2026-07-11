#include <bits/stdc++.h>

using namespace std;

int main(){

    iostream::sync_with_stdio(false);
    cin.tie(0);

    string s;
    cin >> s;

    vector<int> count(26, 0); // one counter per letter

    for(int i = 0; i < s.size(); i++){
        count[s[i] - 'a']++; // 'b' - 'a' = 1, so 'b' is counted at index 1
    }

    for(int i = 0; i < 26; i++){

        if(count[i] > 0){ // only letters that appear

            char c = 'a' + i; // back from index to letter
            cout << c << ": " << count[i] << '\n';
        }
    }

    return 0;
}
