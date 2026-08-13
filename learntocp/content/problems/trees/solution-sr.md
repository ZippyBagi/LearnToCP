
## Pristup

Za fiksiranu visinu testere $h$ lako je prebrojati drvo: svako stablo više od $h$ daje $h_i - h$ metara, ostala ne daju ništa. Mogli bismo da probamo $h = 0, 1, 2, \dots$ i stanemo na poslednjoj visini koja radi - ali najviše drvo može biti $10^4$ metara, a drveća može biti $10^5$, što je $10^9$ koraka.

Ne moramo da probamo sve. Primeti da spuštanje testere nikada ne oduzima drvo: stablo koje se već seklo prosto daje još jedan metar, a stabla koja su bila prekratka mogu početi da daju nešto. Znači, ako visina $h$ daje dovoljno drveta, daje ga i svaka visina ispod nje:

`DA DA DA ... DA NE NE NE`

a mi tražimo **poslednje DA**. To je tačno binarna pretraga po rešenju.

Funkcija `check` je gornja petlja za brojanje, u $O(n)$:

- `low = 0` - testera na zemlji uvek radi, jer postavka garantuje da u šumi ima dovoljno drveta;
- `high` - najviše drvo, koje nalazimo pomoću `max_element` (zgodna C++ funkcija koja vraća iterator na najveći element; obična for petlja radi isti posao).

**Pažnja:** ovde visina koja radi znači da treba da tražimo **više**, a ne niže - pa je uspešna grana ona koja pomera `low`. Zapamti `mid` u `ans` pre nego što nastaviš, inače ćeš izgubiti najbolju visinu koja radi.

## Primer

Prva šuma je $[24, 21, 19, 14, 22]$, a Milanu treba $14$ metara:

| `low` | `high` | `mid` | drvo na `mid` | |
|---|---|---|---|---|
| $0$ | $24$ | $12$ | $40$ | dovoljno |
| $13$ | $24$ | $18$ | $14$ | dovoljno |
| $19$ | $24$ | $21$ | $4$ | premalo |
| $19$ | $20$ | $19$ | $10$ | premalo |

Proveri drugi red: na $18$ metara stabla daju $6 + 3 + 1 + 0 + 4 = 14$ - tačno dovoljno, pa pamtimo $18$ i probamo više. Sve od $19$ naviše pada, i $18$ ostaje kao rešenje.

## Kod

solution.cpp
```cpp
#include <bits/stdc++.h>

using namespace std;

int main(){

    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int t;
    cin>>t;

    while(t--){

        int n, x;
        cin>>n>>x;

        vector<int> a(n);
        for(int i=0;i<n;i++){
            cin>>a[i];
        }

        int low = 0;
        int high = *max_element(a.begin(), a.end()); // above the tallest tree nothing gets cut

        int ans = 0;

        while(low <= high){

            int mid = low + (high - low) / 2;

            int cut = 0;
            for(int i=0;i<n;i++){
                if(a[i] > mid){
                    cut += a[i] - mid; // only the part above the blade falls
                }
            }

            if(cut >= x){
                ans = mid;      // enough wood - try to raise the saw
                low = mid + 1;
            }else{
                high = mid - 1;
            }
        }

        cout<<ans<<'\n';
    }
    return 0;
}
```

Cela šuma staje u $10^5 \cdot 10^4 = 10^9$ metara, što i dalje staje u `int`, pa nam ovde `long long` ne treba. Sa većim drvećem bi trebao - vidi [Drvoseča II](/sr/Problems/trees-2).

## Složenost

Vremenska složenost je $O(n \log H)$, gde je $H$ visina najvišeg drveta.
Memorijska složenost je $O(n)$.
