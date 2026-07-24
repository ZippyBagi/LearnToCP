#include <bits/stdc++.h>

using namespace std;

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        int n;
        cin>>n;

        bool prime = true;
        if(n < 2) prime = false;

        for(int i=2;i*i<=n;i++){
            if(n % i == 0){ // found a divisor, n is not prime
                prime = false;
                break;
            }
        }

        if(prime){
            cout<<"YES"<<'\n';
        }else{
            cout<<"NO"<<'\n';
        }
    }
    return 0;
}
