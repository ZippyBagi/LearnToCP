// independent check: keep only letters, sort both, compare
#include <bits/stdc++.h>
using namespace std;
int main(){
    int t;
    string line;
    getline(cin,line); t=stoi(line);
    while(t--){
        string a,b,x="",y="";
        getline(cin,a); getline(cin,b);
        for(char c:a) if(c>='a'&&c<='z') x+=c;
        for(char c:b) if(c>='a'&&c<='z') y+=c;
        sort(x.begin(),x.end()); sort(y.begin(),y.end());
        printf("%s\n",x==y?"YES":"NO");
    }
    return 0;
}
