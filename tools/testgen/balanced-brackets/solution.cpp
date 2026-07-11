#include <bits/stdc++.h>

using namespace std;

int main(){

    iostream::sync_with_stdio(false);
    cin.tie(0);

    string s;
    cin >> s;

    stack<char> st;

    for(int i = 0; i < s.size(); i++){

        if(s[i] == '('){

            st.push(s[i]); // an opener, waiting for its pair

        }else{

            if(st.empty()){ // a closer with nobody to close
                cout << "NO";
                return 0;
            }
            st.pop();
        }
    }

    if(st.empty()){
        cout << "YES";
    }else{ // some openers were never closed
        cout << "NO";
    }

    return 0;
}
