#include <bits/stdc++.h>

using namespace std;

vector<int> a, tmp;

// sorts a[left..right) and returns how many inversions live inside it
long long sortCount(int left, int right){

    if(right - left < 2){
        return 0; // a single element cannot be inverted with anything
    }

    int mid = left + (right - left) / 2;

    long long inversions = sortCount(left, mid) + sortCount(mid, right);

    int i = left, j = mid, k = left;

    while(i < mid && j < right){
        if(a[i] <= a[j]){
            tmp[k] = a[i]; // not an inversion - equal counts as not inverted
            i++;
        }else{
            tmp[k] = a[j];
            j++;
            inversions += mid - i; // a[j] jumps over the whole rest of the left half
        }
        k++;
    }

    while(i < mid){ tmp[k] = a[i]; i++; k++; }
    while(j < right){ tmp[k] = a[j]; j++; k++; }

    for(int p=left;p<right;p++){
        a[p] = tmp[p];
    }

    return inversions;
}

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        int n;
        cin>>n;

        a = vector<int>(n);   // a fresh array for every testcase
        tmp = vector<int>(n); // scratch space the merge writes into
        for(int i=0;i<n;i++){
            cin>>a[i];
        }

        cout<<sortCount(0, n)<<'\n';
    }
    return 0;
}
