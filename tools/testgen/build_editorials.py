#!/usr/bin/env python3
"""Writes the four editorial files, taking the ```cpp block straight out of
tools/testgen/<slug>/solution.cpp so the published code cannot drift from the
code the .out files came from (guide-verification.md, Tier 0)."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
PROB = os.path.join(HERE, '../../learntocp/content/problems')

def code(slug):
    return open(os.path.join(HERE, slug, 'solution.cpp'), encoding='utf-8').read()

CD_EN = """
## Approach

The obvious plan - list every group of cities and throw away the ones that do not hang together - dies immediately. One city joined to $999$ others already has a $139$ digit number of districts of at most $100$ cities. We have to count them without ever writing one down, which is what the modulus in the output is telling us.

Root the tree at city $1$, the way the lesson does. Now every district has a **topmost city**: the one closest to the root. There is exactly one, because two cities of the district with nothing above them could not be joined inside the district. So if we count, for every city $v$, the districts whose topmost city is $v$, every district is counted once and nothing is counted twice.

A district with topmost city $v$ lies entirely inside the subtree of $v$ and contains $v$. That is our state:

$cnt[v][j]$ - the number of districts of **exactly $j$ cities** that lie inside the subtree of $v$ and contain $v$.

A leaf has one such district, itself: $cnt[v][1] = 1$.

### Adding one child at a time

Take the children of $v$ one by one. Suppose we have already handled some of them, and $cnt[v][a]$ counts the districts of $a$ cities built from $v$ and those children. A new child $c$ leaves two choices, and they cannot be mixed:

- **Take nothing from $c$.** The district stops at $v$ on that side. It still has its $a$ cities, so it stays a district of size $a$.
- **Take a piece of $c$'s subtree that contains $c$ itself.** It has to contain $c$: the only road from $v$ into that subtree runs to $c$, so a piece that left $c$ out would not touch $v$ and the district would fall apart. There are $cnt[c][b]$ such pieces of $b$ cities.

**The second choice is where $a + b$ comes from.** The district we had holds $a$ cities - city $v$ and cities from the children we have already folded in. The piece from $c$ holds $b$ cities, and every one of them lives in $c$'s subtree, so no city is in both halves. Glue them together and the result has exactly $a + b$ cities. Any of the $cnt[v][a]$ old districts can take any of the $cnt[c][b]$ pieces, so that pair of sizes produces $cnt[v][a] \\cdot cnt[c][b]$ new districts of size $a + b$:

$$new[a] = new[a] + cnt[v][a]$$
$$new[a+b] = new[a+b] + cnt[v][a] \\cdot cnt[c][b]$$

The first line runs once for every size $a$ we hold, the second once for every pair of sizes - which is exactly the double loop in the code, `nxt[a] += cnt[a]` and `nxt[a+b] += cnt[a] * sub[b]`.

To see it land, take city $1$ in the example below, at the moment city $2$ is folded in and city $3$ is not. We hold $1$ district of $2$ cities ($\\{1,2\\}$) and $2$ of $3$ cities ($\\{1,2,4\\}$ and $\\{1,2,5\\}$), and city $3$ offers one piece of $1$ city. Then $new[3]$ collects $2$ from the first line - the two three-city districts that simply ignore city $3$ - and $1 \\cdot 1$ from the second, with $a = 2$ and $b = 1$: $\\{1,2\\}$ glued to $\\{3\\}$. That is the last row of the table below, $[1, 1, 2]$ going in and $[1, 2, 3]$ coming out.

Once all the children are folded in, add $cnt[v][1] + cnt[v][2] + \\dots + cnt[v][K]$ to the answer and hand $cnt[v]$ back to the parent.

### Cutting the rows off at $K$

Count the multiplications. A merge at $v$ pairs every size on the left with every size on the right, and over the whole tree those pairs are exactly the pairs of cities - each pair is multiplied together once, at their topmost common city and nowhere else. Left alone that is $\\frac{n(n-1)}{2}$ multiplications, or $O(n^2)$.

But a district may never hold more than $K$ cities, so every entry above $K$ is dead weight, and the fix is one $\\min$: cut each `cnt` row off at $\\min(\\text{subtree size}, K)$. Now neither side of a merge is longer than $K$, and the same pair-counting argument gives $O(n \\cdot K)$.

Both fit inside the limits here - $n$ only reaches $1000$ - so this is not the difference between passing and failing today. It is the difference between code that stays fast on a tree a hundred times larger and code that does not, and it costs one extra $\\min$.

**Careful:** `cnt[a]` and `sub[b]` are both already reduced, so each is below $10^9 + 7$ - but their product reaches $10^{18}$, which an `int` cannot hold. Multiply in `long long` and reduce immediately afterwards.

## Example

The first testcase, with $K = 3$, rooted at city $1$:

```
    1
   / \\
  2   3
 / \\
4   5
```

Write a city's row as $[cnt[v][1], cnt[v][2], cnt[v][3]]$. Children are finished before their parents, so the leaves and the merges come in this order:

| at | folding in | so far | child's row | after | what the $a + b$ line built |
| ---- | ---- | ---- | ---- | ---- | ---- |
| $4$ | - | - | - | $[1, 0, 0]$ | nothing yet - a leaf starts as $\\{4\\}$ |
| $5$ | - | - | - | $[1, 0, 0]$ | the same, $\\{5\\}$ |
| $2$ | city $4$ | $[1, 0, 0]$ | $[1, 0, 0]$ | $[1, 1, 0]$ | $\\{2,4\\}$, from $a = 1$ and $b = 1$ |
| $2$ | city $5$ | $[1, 1, 0]$ | $[1, 0, 0]$ | $[1, 2, 1]$ | $\\{2,5\\}$ from $a = 1$, and $\\{2,4,5\\}$ from $a = 2$ |
| $3$ | - | - | - | $[1, 0, 0]$ | another leaf, $\\{3\\}$ |
| $1$ | city $2$ | $[1, 0, 0]$ | $[1, 2, 1]$ | $[1, 1, 2]$ | $\\{1,2\\}$ from $b = 1$, then $\\{1,2,4\\}$ and $\\{1,2,5\\}$ from $b = 2$ |
| $1$ | city $3$ | $[1, 1, 2]$ | $[1, 0, 0]$ | $[1, 2, 3]$ | $\\{1,3\\}$, and $\\{1,2,3\\}$ from $a = 2$ |

The last column lists only what gluing produced. Everything in the **so far** column survives on top of it, because that is exactly what the other line copies over - the districts that ignore the new child. City $2$ keeps $\\{2,4\\}$ through its second merge that way, and city $1$'s last row keeps both three-city districts it walked in with.

Look closely at the merge where city $1$ folds in city $2$. The child's row offers a three-city district as well, $\\{2,4,5\\}$, but taking it would mean $a = 1$ together with $b = 3$, and $4$ cities is past $K$ - so it never enters the row. That is the cap from the section above, doing its work on a tree of five cities.

A finished row goes straight into the answer: cities $3$, $4$ and $5$ give $1$ each, city $2$ gives $1 + 2 + 1 = 4$, and city $1$ gives $1 + 2 + 3 = 6$. Altogether $1 + 1 + 1 + 4 + 6 = 13$, which is the expected output.

## Code

solution.cpp
```cpp
%s```

## Complexity

Time $O(n \\cdot K)$
Memory $O(n \\cdot K)$

The memory bound is the recursion: every level of the tree holds one row of at most $K + 1$ numbers, and a tree can be a path. At the limits that is $10^5$ numbers, comfortably inside the limit.
"""

CD_SR = r"""
## Pristup

Prvo što pada na pamet - ispisati svaku grupu gradova pa odbaciti one koje nisu povezane - ne dolazi u obzir. Jedan jedini grad na koji je zakačeno još $999$ njih ima 139-cifren broj oblasti od najviše $100$ gradova. Njih dakle moramo da izbrojimo a da nijednu ne ispišemo, i baš na to nas modul u izlazu i podseća.

Proglasimo grad $1$ korenom, kao u lekciji. Svaka oblast sada ima svoj **najviši grad**, onaj najbliži korenu, i takav je uvek samo jedan: put između dva grada iste oblasti ide preko njihovog zajedničkog pretka, a taj predak mora i sam biti u oblasti, i stoji iznad oba - pa oba ne mogu biti najviša. Zato možemo za svaki grad $v$ da izbrojimo oblasti kojima je baš $v$ najviši, i tako svaku oblast obuhvatiti tačno jednom.

Oblast kojoj je $v$ najviši grad cela staje u podstablo grada $v$ i sadrži $v$. Odatle i stanje:

$cnt[v][j]$ - koliko ima oblasti od **tačno $j$ gradova** koje leže u podstablu grada $v$ i sadrže $v$.

Za list je to lako: jedina takva oblast je on sam, pa je $cnt[v][1] = 1$.

### Dete po dete

Decu grada $v$ obrađujemo jedno po jedno. Neka je nekoliko njih već obrađeno i neka $cnt[v][a]$ broji oblasti od $a$ gradova sklopljene od $v$ i te dece. Kad na red dođe novo dete $c$, biramo jedno od dvoga:

- **Iz $c$ ne uzimamo ništa.** Oblast se na toj strani zaustavlja u $v$ i ostaje joj istih $a$ gradova.
- **Iz podstabla deteta $c$ uzimamo komad u kome je i sam grad $c$.** Grad $c$ mora da bude u njemu: iz $v$ u to podstablo vodi jedino put do $c$, pa komad bez $c$ ničim ne bi dodirivao $v$ i oblast bi se prekinula. Takvih komada od $b$ gradova ima $cnt[c][b]$.

**Odatle i $a + b$.** U oblasti koju držimo je $a$ gradova - sam $v$ i gradovi iz već obrađene dece. U komadu iz $c$ je $b$ gradova, a svi oni leže u podstablu deteta $c$, pa nijedan grad ne može da bude i tu i tamo. Kad to dvoje spojimo, u novoj oblasti stoji tačno $a + b$ gradova. Uz to, svaka od $cnt[v][a]$ starih oblasti sme da uzme bilo koji od $cnt[c][b]$ komada, pa taj par veličina daje $cnt[v][a] \cdot cnt[c][b]$ novih oblasti od $a + b$ gradova:

$$new[a] = new[a] + cnt[v][a]$$
$$new[a+b] = new[a+b] + cnt[v][a] \cdot cnt[c][b]$$

Prva jednakost se primeni po jednom za svaku veličinu $a$ koju držimo, a druga po jednom za svaki par veličina - to su tačno dve ugnežđene petlje u kodu, `nxt[a] += cnt[a]` i `nxt[a+b] += cnt[a] * sub[b]`.

Uhvatimo to na delu u gradu $1$ iz primera ispod, i to u trenutku kad je grad $2$ već obrađen a grad $3$ još nije. Držimo jednu oblast od $2$ grada ($\{1,2\}$) i dve od $3$ grada ($\{1,2,4\}$ i $\{1,2,5\}$), a grad $3$ nudi jedan komad od jednog grada. U $new[3]$ tada uđe dvojka iz prve jednakosti - te dve trogradske oblasti prosto zaobiđu grad $3$ - i još $1 \cdot 1$ iz druge, za $a = 2$ i $b = 1$: $\{1,2\}$ spojeno sa $\{3\}$. To je poslednja vrsta u tabeli ispod: $[1, 1, 2]$ ulazi, $[1, 2, 3]$ izlazi.

Kad su sva deca obrađena, dodaj $cnt[v][1] + cnt[v][2] + \dots + cnt[v][K]$ na rešenje i vrati $cnt[v]$ roditelju.

### Sečenje vrsta na $K$

Prebrojimo množenja. Pri spajanju u gradu $v$ svaka veličina s jedne strane se pomnoži sa svakom s druge, a preko celog stabla ti parovi nisu ništa drugo do parovi gradova - svaki par se pomnoži tačno jednom, u svom najvišem zajedničkom gradu, i nigde više. Ako ništa ne preduzmemo, to je $\frac{n(n-1)}{2}$ množenja, dakle $O(n^2)$.

Ali u oblast ne sme da uđe više od $K$ gradova, pa nam sve preko $K$ i ne treba, a rešava ga jedan jedini $\min$: odseci svaku `cnt` vrstu na $\min(\text{veličina podstabla}, K)$. Sada nijedna strana spajanja nije duža od $K$, pa isto brojanje parova daje $O(n \cdot K)$.

Ovde oboje staje u ograničenja, jer $n$ ide samo do $1000$, pa to nije razlika između prolaza i pada. Razlika je u tome što isti kod ostaje brz i na sto puta većem stablu, a plaća se jednim $\min$ više.

**Pažnja:** i `cnt[a]` i `sub[b]` su već svedeni po modulu, pa je svaki manji od $10^9 + 7$ - ali njihov proizvod ide do $10^{18}$, a toliko `int` ne može da primi. Množi u `long long` pa odmah svedi po modulu.

## Primer

Prvi test primer, uz $K = 3$ i koren u gradu $1$:

```
    1
   / \
  2   3
 / \
4   5
```

Vrstu jednog grada zapisujemo kao $[cnt[v][1], cnt[v][2], cnt[v][3]]$. Deca se završavaju pre roditelja, pa listovi i spajanja idu ovim redom:

| u gradu | uklapa se | dotad | vrsta deteta | posle | šta je napravila linija $a + b$ |
| ---- | ---- | ---- | ---- | ---- | ---- |
| $4$ | - | - | - | $[1, 0, 0]$ | zasad ništa - list počinje kao $\{4\}$ |
| $5$ | - | - | - | $[1, 0, 0]$ | isto tako, $\{5\}$ |
| $2$ | grad $4$ | $[1, 0, 0]$ | $[1, 0, 0]$ | $[1, 1, 0]$ | $\{2,4\}$, iz $a = 1$ i $b = 1$ |
| $2$ | grad $5$ | $[1, 1, 0]$ | $[1, 0, 0]$ | $[1, 2, 1]$ | $\{2,5\}$ iz $a = 1$, i $\{2,4,5\}$ iz $a = 2$ |
| $3$ | - | - | - | $[1, 0, 0]$ | još jedan list, $\{3\}$ |
| $1$ | grad $2$ | $[1, 0, 0]$ | $[1, 2, 1]$ | $[1, 1, 2]$ | $\{1,2\}$ iz $b = 1$, pa $\{1,2,4\}$ i $\{1,2,5\}$ iz $b = 2$ |
| $1$ | grad $3$ | $[1, 1, 2]$ | $[1, 0, 0]$ | $[1, 2, 3]$ | $\{1,3\}$, i $\{1,2,3\}$ iz $a = 2$ |

U poslednjoj koloni stoji samo ono što je lepljenje napravilo. Sve iz kolone **dotad** ostaje i dalje tu, jer to baš prepisuje ona druga linija - oblasti koje novo dete zaobilaze. Tako grad $2$ kroz drugo spajanje zadrži $\{2,4\}$, a gradu $1$ u poslednjoj vrsti ostaju obe trogradske oblasti sa kojima je u nju i ušao.

Pogledaj pažljivo spajanje u kome grad $1$ uklapa grad $2$. U vrsti deteta stoji i jedna trogradska oblast, $\{2,4,5\}$, ali bi njeno uzimanje značilo $a = 1$ uz $b = 3$, a $4$ grada su preko $K$ - pa ona u vrstu nikada i ne uđe. To je sečenje iz prethodnog odeljka, na stablu od pet gradova.

Gotova vrsta ide pravo u rešenje: gradovi $3$, $4$ i $5$ daju po $1$, grad $2$ daje $1 + 2 + 1 = 4$, a grad $1$ daje $1 + 2 + 3 = 6$. Sve zajedno $1 + 1 + 1 + 4 + 6 = 13$, baš kao u izlazu.

## Kod

solution.cpp
```cpp
%s```

## Složenost

Vremenska složenost je $O(n \cdot K)$
Memorijska složenost je $O(n \cdot K)$

Memoriju troši rekurzija: na svakom nivou stabla stoji po jedna vrsta od najviše $K + 1$ brojeva, a stablo ume da bude i običan put. Na granicama je to $10^5$ brojeva, daleko ispod ograničenja.
"""

TD_EN = """
## Approach

The definition suggests the algorithm: measure every pair and keep the largest. A search from one outpost gives its distance to all the others in $O(n)$, so running one from every outpost costs $O(n^2)$ - which at $n = 10^5$ is $10^{10}$ steps. Far too slow, but it is worth writing down, because it is what we are going to beat twice.

### Rooting the tree

Root the park at outpost $1$. Every route has a **highest** outpost, the one closest to the root, and from there it goes down into two different children - or ends right at the top. So if

$down[v]$ - the number of trails on the longest walk from $v$ straight down into its own subtree

then the best route whose highest outpost is $v$ is the sum of the two largest $down[c] + 1$ over $v$'s children, taking the missing ones as $0$. And $down[v]$ itself is the largest of those same values:

$$down[v] = \\max_{c \\text{ a child of } v} (down[c] + 1)$$

One walk over the tree fills this in, children before parents, and the answer is the largest sum found at any outpost. That is $O(n)$ and it is already a complete solution.

### Two searches instead

There is a shorter one, and it needs no rooting at all.

**Start anywhere and walk to the farthest outpost you can. That outpost is the end of a longest route.** So one search from outpost $1$ finds an outpost $u$, and a second search from $u$ measures the diameter directly - its largest distance is the answer.

Why is the farthest outpost always an endpoint? Root at the outpost we started from, and let $u$ be a deepest outpost. Take any longest route, call its highest outpost $t$, and let it descend $d_1$ into one child of $t$ and $d_2 \\le d_1$ into another, so the route is $d_1 + d_2$ long and its ends are at depths $depth(t) + d_1$ and $depth(t) + d_2$. Since $u$ is a deepest outpost, $depth(u) \\ge depth(t) + d_1$.

- If $u$ sits under a different child of $t$ than the deeper end does, or is not under $t$ at all, the route from $u$ to that deeper end meets it at $t$ or higher, so it is at least $(depth(u) - depth(t)) + d_1 \\ge d_1 + d_1$ long.
- Otherwise $u$ is under the same child as the deeper end, and then the route from $u$ to the **other** end meets it exactly at $t$, so it is $(depth(u) - depth(t)) + d_2 \\ge d_1 + d_2$ long.

Either way $u$ is one end of a route at least as long as the longest, so it is an endpoint of a longest route too.

Two searches is $O(n)$ as well, but it is a handful of lines, and since a queue does the walking there is no recursion - which matters, because a park shaped like a single line of $10^5$ outposts would mean $10^5$ nested calls for the rooted version.

**Careful:** one search is not enough. It measures how far things are from **outpost $1$**, which is a different question - on the example it reports $3$ rather than $6$, because outpost $1$ sits in the middle of the longest route. The first search is only there to find a starting point for the second.

## Example

The first testcase, with the first search starting at outpost $1$:

| search | starts at | distances it finds | farthest |
| ---- | ---- | ---- | ---- |
| first | $1$ | $1:0$, $2:1$, $3:1$, $4:2$, $5:2$, $6:3$, $7:3$ | $6$ |
| second | $6$ | $6:0$, $4:1$, $2:2$, $1:3$, $3:4$, $5:5$, $7:6$ | $7$ |

The first search never sees a distance above $3$. The second one starts from an end of the longest route and walks the whole thing, ending at outpost $7$ at distance $6$ - the answer. Outposts $6$ and $7$ are tied at distance $3$ in the first search, and starting the second one from $7$ instead would end at $6$, also at distance $6$: which end we find first does not matter.

## Code

solution.cpp
```cpp
%s```

## Complexity

Time $O(n)$
Memory $O(n)$
"""

TD_SR = r"""
## Pristup

Iz same definicije ispada i algoritam: izmeri svaki par i zapamti najveći rezultat. Jedna pretraga iz neke ispostave daje rastojanja do svih ostalih u $O(n)$, pa pretraga iz svake košta $O(n^2)$ - a pri $n = 10^5$ to je $10^{10}$ koraka. Presporo, ali vredi ga imati na umu, jer ćemo ga dvaput poboljšati.

### Koren u stablu

Postavimo koren parka u ispostavu $1$. Svaki put ima svoju **najvišu** ispostavu, onu najbližu korenu, i iz nje silazi u dvoje različite dece - ili se baš tu i završava. Uvedimo zato

$down[v]$ - koliko se najviše staza pređe na šetnji iz $v$ pravo naniže, kroz sopstveno podstablo

Najbolji put kome je $v$ najviša ispostava je zbir dve najveće vrednosti $down[c] + 1$ po deci ispostave $v$, s tim što ono što fali računamo kao $0$. A sam $down[v]$ je najveća od tih istih vrednosti:

$$down[v] = \max_{c \text{ dete od } v} (down[c] + 1)$$

Jedna šetnja kroz stablo ovo popuni, decu pre roditelja, a rešenje je najveći zbir na koji smo naišli. To je $O(n)$ i zadatak je time već rešen.

### Umesto toga, dve pretrage

Ima i kraće, a korenovanje mu uopšte ne treba.

**Kreni gde god hoćeš i idi do ispostave koja ti je najdalja. Ona je kraj nekog najdužeg puta.** Prva pretraga, iz ispostave $1$, nađe takvu ispostavu $u$, a druga, iz $u$, meri prečnik neposredno - njeno najveće rastojanje je rešenje.

Zašto je najdalja ispostava uvek kraj? Stavimo koren u ispostavu iz koje smo krenuli i neka je $u$ najdublja ispostava u parku. Uzmimo bilo koji najduži put, neka mu je najviša ispostava $t$, i neka iz $t$ silazi $d_1$ u jedno dete i $d_2 \le d_1$ u drugo - dužina mu je onda $d_1 + d_2$, a krajevi stoje na dubinama $depth(t) + d_1$ i $depth(t) + d_2$. Pošto dublje od $u$ nema ničega, važi $depth(u) \ge depth(t) + d_1$.

- Ako je $u$ ispod nekog drugog deteta od $t$ nego dublji kraj, ili uopšte nije ispod $t$, put od $u$ do tog dubljeg kraja sastaje se s njim u $t$ ili još više, pa je dug bar $(depth(u) - depth(t)) + d_1 \ge d_1 + d_1$.
- Inače je $u$ ispod istog deteta kao i dublji kraj, pa put od $u$ do **drugog** kraja prolazi tačno kroz $t$ i dug je $(depth(u) - depth(t)) + d_2 \ge d_1 + d_2$.

U oba slučaja se iz $u$ pruža put koji nije kraći od najdužeg, a to znači da je i $u$ kraj nekog najdužeg puta.

I dve pretrage su $O(n)$, ali staju u nekoliko linija, a pošto posao obavlja red, rekurzije nigde nema - što nije sitnica, jer bi park razvučen u jednu liniju od $10^5$ ispostava značio $10^5$ ugnežđenih poziva za rešenje sa korenom.

**Pažnja:** jedna pretraga nije dovoljna. Ona odgovara na pitanje koliko je šta udaljeno od **ispostave $1$**, a to nije isto pitanje - na primeru bi javila $3$ umesto $6$, jer ispostava $1$ stoji na sredini najdužeg puta. Prva pretraga služi samo da drugoj nađe odakle da krene.

## Primer

Prvi test primer, gde prva pretraga kreće iz ispostave $1$:

| pretraga | kreće iz | rastojanja koja nalazi | najdalja |
| ---- | ---- | ---- | ---- |
| prva | $1$ | $1:0$, $2:1$, $3:1$, $4:2$, $5:2$, $6:3$, $7:3$ | $6$ |
| druga | $6$ | $6:0$, $4:1$, $2:2$, $1:3$, $3:4$, $5:5$, $7:6$ | $7$ |

Prva pretraga nigde ne naiđe na rastojanje veće od $3$. Druga kreće sa kraja najdužeg puta i pređe ga celog, pa staje u ispostavi $7$, na rastojanju $6$ - to je rešenje. Šestica i sedmica su u prvoj pretrazi izjednačene na rastojanju $3$, pa da je druga krenula iz sedmice, stala bi u šestici, opet na $6$: koji od dva kraja prvo nađemo nije bitno.

## Kod

solution.cpp
```cpp
%s```

## Složenost

Vremenska složenost je $O(n)$
Memorijska složenost je $O(n)$
"""

for slug, en, sr in (('counting-districts', CD_EN, CD_SR),
                     ('tree-diameter', TD_EN, TD_SR)):
    c = code(slug)
    open(os.path.join(PROB, slug, 'solution-en.md'), 'w', encoding='utf-8').write(en % c)
    open(os.path.join(PROB, slug, 'solution-sr.md'), 'w', encoding='utf-8').write(sr % c)
    print('wrote', slug)
