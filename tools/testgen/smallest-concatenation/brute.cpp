// exhaustive: tries every permutation (small n only)
#include <bits/stdc++.h>
using namespace std;
int main(){
    int t; scanf("%d",&t);
    while(t--){
        int n; scanf("%d",&n);
        vector<string> a(n);
        for(auto &s:a){char buf[20];scanf("%s",buf);s=buf;}
        sort(a.begin(),a.end());
        string best="";
        do{
            string cur="";
            for(auto &s:a) cur+=s;
            if(best==""||cur.size()<best.size()||(cur.size()==best.size()&&cur<best)) best=cur;
        }while(next_permutation(a.begin(),a.end()));
        printf("%s\n",best.c_str());
    }
    return 0;
}
