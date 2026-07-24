// independent evaluation: recursive descent from the back of the expression
#include <bits/stdc++.h>
using namespace std;
string s; int pos;
long long eval(){
    char c=s[pos--];
    if(c>='0'&&c<='9') return c-'0';
    long long b=eval();
    long long a=eval();
    return c=='+'?a+b:a*b;
}
int main(){
    int t; scanf("%d",&t);
    while(t--){
        char buf[300]; scanf("%s",buf);
        s=buf; pos=s.size()-1;
        printf("%lld\n",eval());
    }
    return 0;
}
