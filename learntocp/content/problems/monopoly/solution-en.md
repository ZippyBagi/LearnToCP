
## Approach

The board is a **circle** of $n$ fields, so a player who traveled $a$ fields stands on field $a \bmod n$ - every full lap of $n$ fields brings him back to where he was, only the **remainder** matters. This is exactly the pattern from the modulo lesson: positions repeat $0, 1, \dots, n-1, 0, 1, \dots$

So first replace $a$ and $b$ by the actual positions: `a = a % n` and `b = b % n`. Now both are fields between $0$ and $n-1$, and we need the number of steps forward from field $a$ to field $b$. There are two cases:

- if $b \ge a$, the answer is simply $b - a$;
- if $b < a$, the first player must go past field $0$: $n - a$ steps to reach $0$, then $b$ more.

Both cases are one formula:

$$s = (b - a + n) \bmod n$$

**Careful:** the $+ n$ is not decoration. Since $b - a$ can be negative (down to $-(n-1)$), and `%` in C++ keeps the sign of the left side, `(b - a) % n` could be negative. Adding $n$ first makes the value positive without changing the remainder.

## Example

| $n$ | $a$ | $b$ | $a \ \% \ n$ | $b \ \% \ n$ | $(b - a + n) \ \% \ n$ |
|-----|-----|-----|--------------|--------------|------------------------|
| $10$ | $3$ | $7$ | $3$ | $7$ | $(7 - 3 + 10) \ \% \ 10 = $ **$4$** |
| $10$ | $7$ | $3$ | $7$ | $3$ | $(3 - 7 + 10) \ \% \ 10 = $ **$6$** |

The first row is the easy case: $b \ge a$, and the $+n$ is removed by the final $\% \ n$. The second row is the wrap-around: $3 - 7 = -4$, and $-4 + 10 = 6$ - moving forward $6$ fields from field $7$ really ends on field $3$.

## Code

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

## Complexity

Time $O(t)$
Memory $O(1)$
