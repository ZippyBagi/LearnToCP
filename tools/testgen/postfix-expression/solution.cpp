#include <bits/stdc++.h>

using namespace std;

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        string s;
        cin>>s;

        stack<long long> st; // intermediate values can be large

        for(char c : s){
            if(c >= '0' && c <= '9'){
                st.push(c - '0'); // a number goes straight to the stack
            }else{
                long long b = st.top(); st.pop(); // the right operand was pushed last
                long long a = st.top(); st.pop();
                if(c == '+'){
                    st.push(a + b);
                }else{
                    st.push(a * b);
                }
            }
        }

        cout<<st.top()<<'\n'; // the value of the whole expression
    }
    return 0;
}
