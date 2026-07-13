
## Pristup

Tabla je **krug** od $n$ polja, pa igrač koji je prešao $a$ polja stoji na polju $a \bmod n$ - svaki pun krug od $n$ polja ga vraća tamo gde je bio, bitan je samo **ostatak**. Ovo je tačno obrazac iz lekcije o modulu: pozicije se ponavljaju $0, 1, \dots, n-1, 0, 1, \dots$

Zato prvo zameni $a$ i $b$ stvarnim pozicijama: `a = a % n` i `b = b % n`. Sada su oba polja između $0$ i $n-1$, a tražimo broj koraka unapred od polja $a$ do polja $b$. Postoje dva slučaja:

- ako je $b \ge a$, odgovor je prosto $b - a$;
- ako je $b < a$, prvi igrač mora da prođe pored polja $0$: $n - a$ koraka do $0$, pa još $b$.

Oba slučaja staju u jednu formulu:

$$s = (b - a + n) \bmod n$$

**Pažnja:** ono $+ n$ nije ukras. Pošto $b - a$ može biti negativno (najmanje $-(n-1)$), a `%` u C++-u zadržava znak leve strane, `(b - a) % n` bi mogao biti negativan. Dodavanje $n$ pre deljenja čini vrednost pozitivnom, a ostatak ne menja.

## Primer

| $n$ | $a$ | $b$ | $a \ \% \ n$ | $b \ \% \ n$ | $(b - a + n) \ \% \ n$ |
|-----|-----|-----|--------------|--------------|------------------------|
| $10$ | $3$ | $7$ | $3$ | $7$ | $(7 - 3 + 10) \ \% \ 10 = $ **$4$** |
| $10$ | $7$ | $3$ | $7$ | $3$ | $(3 - 7 + 10) \ \% \ 10 = $ **$6$** |

Prvi red je lakši slučaj: $b \ge a$, pa završno $\% \ n$ poništi ono $+n$. Drugi red je obilazak kruga: $3 - 7 = -4$, a $-4 + 10 = 6$ - kretanje $6$ polja unapred sa polja $7$ zaista se završava na polju $3$.

## Kod

solution.cpp
```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    iostream::sync_with_stdio(false);
    cin.tie(0);
    int t;
    cin >> t;
    while(t--) {
        int n, a, b;
        cin >> n >> a >> b;
        a = a % n; // position of the first player
        b = b % n; // position of the second player
        cout << (b - a + n) % n << "\n";
    }
    return 0;
}
```

## Složenost

Vremenska složenost je $O(t)$.
Memorijska složenost je $O(1)$.
