#include <bits/stdc++.h>

using namespace std;

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;
    cin.ignore(); // skip the newline left behind after reading the number

    while(t--){

        string s1, s2;
        getline(cin, s1); // the lines contain spaces, so cin>> would not work
        getline(cin, s2);

        vector<int> cnt1(26, 0), cnt2(26, 0);

        for(char c : s1){
            if(c >= 'a' && c <= 'z'){ // everything that is not a letter is ignored
                cnt1[c - 'a']++;
            }
        }
        for(char c : s2){
            if(c >= 'a' && c <= 'z'){
                cnt2[c - 'a']++;
            }
        }

        if(cnt1 == cnt2){
            cout<<"YES"<<'\n';
        }else{
            cout<<"NO"<<'\n';
        }
    }
    return 0;
}
