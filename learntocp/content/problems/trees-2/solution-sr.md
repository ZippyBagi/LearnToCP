
## Pristup

Binarna pretraga iz zadatka [Drvoseča](/sr/Problems/trees) i dalje nalazi rešenje: ako neka visina testere daje dovoljno drveta, daje ga i svaka niža, pa tražimo poslednju visinu koja radi.

Ono što puca je cena jedne provere. Prolazak kroz svih $n$ stabala košta $O(n)$, a sada ga plaćamo $\log H \approx 30$ puta **po porudžbini** - do $10^5 \cdot 10^5 \cdot 30$ koraka. Pretraga ostaje, provera mora da postane brža.

### Do kojih stabala testera dopire?

Samo do onih viših od sečiva. Ako **sortiramo** visine, ta stabla su uvek **sufiks** sortiranog niza - sve od prvog stabla visine $\ge h$ do kraja. Tu prvu poziciju vraća baš `lower_bound`, u $O(\log n)$:

~!
```cpp
int idx = lower_bound(a.begin(), a.end(), h) - a.begin();
```

Stabla visine tačno $h$ mogu i da uđu i da ne uđu u sufiks - u oba slučaja daju $h - h = 0$ metara.

### Koliko je to drveta?

Svako od $n - idx$ stabala iz sufiksa daje svoju visinu umanjenu za $h$, pa je

$$drvo(h) = (a_{idx} + a_{idx+1} + \dots + a_{n-1}) - h \cdot (n - idx)$$

Zbir u zagradi je zbir sufiksa, a zbirove sufiksa dobijamo iz **prefiksnih suma**: ako $psum[i]$ čuva zbir prvih $i$ sortiranih visina, to je $psum[n] - psum[idx]$. Time cela provera postaje $O(\log n)$.

Sortiranje i prefiksne sume pravimo jednom po šumi, a svih $q$ porudžbina ih koristi.

**Pažnja:** $10^5$ stabala od $10^9$ metara daje $10^{14}$, a i $h \cdot (n - idx)$ dostiže istu veličinu - daleko preko onoga što `int` može da primi. Visine, prefiksne sume, naručene količine i sve unutar provere moraju biti `long long`.

## Primer

Sortirana, prva šuma je $[14, 19, 21, 22, 24]$ sa $psum = [0, 14, 33, 54, 76, 100]$. Evo poslednje provere za svaku od tri porudžbine - one na samom rešenju:

| porudžbina $x$ | rešenje $h$ | `idx` | zbir sufiksa | posečenih stabala | drvo |
|---|---|---|---|---|---|
| $14$ | $18$ | $1$ | $86$ | $4$ | $86 - 18 \cdot 4 = 14$ |
| $40$ | $12$ | $0$ | $100$ | $5$ | $100 - 12 \cdot 5 = 40$ |
| $1$ | $23$ | $4$ | $24$ | $1$ | $24 - 23 \cdot 1 = 1$ |

Uzmi prvi red: `lower_bound` za $18$ staje na $19$ koje je na poziciji $1$, znači seku se četiri stabla, zajedno visoka $100 - 14 = 86$ metara, a testera od svakog ostavlja $18$ metara da stoji - $86 - 72 = 14$ metara drveta. Metar više ista ta četiri stabla daju samo $10$, i zato je $18$ rešenje.

## Kod

solution.cpp
```cpp
#include <bits/stdc++.h>

using namespace std;

// how much wood the saw set to h gives, in O(log n)
long long cut(vector<long long>& a, vector<long long>& psum, long long h){
    int idx = lower_bound(a.begin(), a.end(), h) - a.begin(); // first tree at least h tall
    long long total = psum[a.size()] - psum[idx];             // their full height
    return total - h * (long long)(a.size() - idx);           // only the part above h
}

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        int n, q;
        cin>>n>>q;

        vector<long long> a(n);
        for(int i=0;i<n;i++){
            cin>>a[i];
        }

        sort(a.begin(), a.end()); // lower_bound needs a sorted array

        vector<long long> psum(n+1, 0);
        for(int i=0;i<n;i++){
            psum[i+1] = psum[i] + a[i]; // psum[i] = sum of the first i heights
        }

        while(q--){

            long long x;
            cin>>x;

            long long low = 0, high = a[n-1], ans = 0;

            while(low <= high){

                long long mid = low + (high - low) / 2;

                if(cut(a, psum, mid) >= x){
                    ans = mid;      // enough wood - try to raise the saw
                    low = mid + 1;
                }else{
                    high = mid - 1;
                }
            }

            cout<<ans<<'\n';
        }
    }
    return 0;
}
```

## Složenost

Vremenska složenost je $O(n \log n + q \log n \log H)$, gde je $H$ visina najvišeg drveta.
Memorijska složenost je $O(n)$.
