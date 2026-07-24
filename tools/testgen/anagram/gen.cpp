#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng;
long long rnd(long long lo,long long hi){return uniform_int_distribution<long long>(lo,hi)(rng);}
const string EXTRA=" .,!?'-";
string randomLine(int len){
    string s="";
    for(int i=0;i<len;i++){
        if(rnd(0,4)==0) s+=EXTRA[rnd(0,EXTRA.size()-1)];
        else s+=char('a'+rnd(0,25));
    }
    return s;
}
string shuffleLetters(const string &src){
    // an anagram of src: same letters reshuffled, different junk characters
    string letters="";
    for(char c:src) if(c>='a'&&c<='z') letters+=c;
    shuffle(letters.begin(),letters.end(),rng);
    string s=""; size_t p=0;
    for(size_t i=0;i<letters.size();i++){
        s+=letters[i];
        if(rnd(0,3)==0) s+=EXTRA[rnd(0,EXTRA.size()-1)];
    }
    return s;
}
int main(int argc,char**argv){
    int id=atoi(argv[1]);
    rng.seed(3000+id);
    if(id==2){
        printf("100\n");
        for(int i=0;i<100;i++){
            string a=randomLine(rnd(1,15));
            if(rnd(0,1)==1) printf("%s\n%s\n",a.c_str(),shuffleLetters(a).c_str()); // true anagram
            else printf("%s\n%s\n",a.c_str(),randomLine(rnd(1,15)).c_str());
        }
    } else if(id==3){
        printf("50\n");
        for(int i=0;i<50;i++){
            string a=randomLine(rnd(50,500));
            if(rnd(0,1)==1) printf("%s\n%s\n",a.c_str(),shuffleLetters(a).c_str());
            else {
                string b=shuffleLetters(a);
                if(!b.empty()&&rnd(0,1)==1) b[rnd(0,b.size()-1)]='a'+rnd(0,25); // almost an anagram
                printf("%s\n%s\n",a.c_str(),b.c_str());
            }
        }
    } else if(id==4){
        // edges: only junk characters (empty letter sets), same word, one letter apart
        printf("4\n...\n???\nabc\ncba\naabb\nabab\nabc\nabcc\n");
    } else if(id==5){
        printf("2\n");
        string a=randomLine(75000);
        printf("%s\n%s\n",a.c_str(),shuffleLetters(a).c_str());
        string b=randomLine(90000);
        printf("%s\n%s\n",b.c_str(),randomLine(90000).c_str());
    }
    return 0;
}
