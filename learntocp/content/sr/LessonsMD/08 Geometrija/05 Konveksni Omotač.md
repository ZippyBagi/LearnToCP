>U ovoj lekciji završavamo poglavlje tako što ceo skup tačaka umotavamo u najtešnji poligon koji ih sve drži.

Sve do sada nam je trebao samo **znak** vektorskog proizvoda, i omotač tu nije izuzetak. On sortira tačke po uglu, ali poređenje koje to sortiranje radi je i dalje samo orijentacija.

### Šta je konveksni omotač

Zakucaj ekser u svaku tačku, razvuci gumicu za kosu oko svih njih i pusti je. Oblik u koji se gumica zategne je **konveksni omotač** - najmanji konveksan poligon koji sadrži sve tačke.

Iz te slike slede dve stvari. Tačka koja je strogo unutra nikada ne dodiruje gumicu, a ne dodiruje je ni tačka koja stoji na sredini neke njene prave stranice. Zato je omotač obično mnogo manji od ulaza, a ono što tražimo su njegovi uglovi, redom obilaska.

	![[hull-rubber-band.png]]

### Grahamov algoritam

#### Teorija

Tri koraka, i uz svaki ide po jedna rečenica o tome zašto radi.

**1. Biramo pivot.** 
- **Najniža** tačka skupa je na omotaču, a ako ih više deli to mesto, uzimamo najlevlju od njih.

- Zašto je ona sigurno ugao? Povuci horizontalnu pravu kroz nju. Sve ostale tačke su na toj pravoj ili iznad nje, pa je pivot na rubu celog skupa, a ne zakopan u njegovoj sredini. Gumica mora da ga dodirne.

**2. Sortiramo sve ostale po uglu oko pivota.** 
- Pošto je pivot najniža tačka, sve ostale su iznad njega, ili u istoj visini a desno od njega, pa se ti uglovi kreću od `0` do malo ispod `180` i redosled nikada nije dvosmislen. Tačke sa istim uglom idu tako da je bliža prva.

- Taj sortirani redosled je pravi razlog zašto algoritam radi. Obiđi gotov omotač suprotno od kazaljke na satu, počevši od pivota: svaki ugao stoji pod većim uglom u odnosu na pivot nego prethodni, jer konveksan oblik ne može da se vraća unazad. Znači uglovi omotača već stoje u sortiranoj listi, tačno onim redom kojim ih želimo, a između njih su razbacane tačke koje nisu uglovi. Mi ne tražimo omotač - mi brišemo sve što omotač nije.

**3. Prolazimo kroz listu sa stekom.** 
- Pre nego što dodamo sledeću tačku, pogledamo poslednje dve na steku: ako one i nova tačka ne prave skretanje ulevo, srednja je udubljenje, pa je skidamo. Skidamo dok skretanje ne postane ulevo, pa tek onda dodajemo.

- Zašto je bezbedno izbaciti tu srednju tačku? Recimo da se stek završava sa `... A B`, a sledeća tačka je `C`. Sortiranje je stavilo `A` pre `B`, a `B` pre `C`, i skretanje u `B` ide na pogrešnu stranu - to dvoje zajedno ostavljaju `B` unutar trougla koji čine pivot, `A` i `C`. Sve tri te tačke su nam date, pa gumica razvučena oko njih prelazi pravo preko `B` a da je ne dodirne. `B` nije ugao, i nijedna tačka koja stigne kasnije to ne može da promeni.

	![[graham-pop.png]]

Znači ništa što pripada omotaču nikada ne biva izbačeno, a ono što ostane na steku skreće ulevo na svakom koraku - a to je tačno ono što konveksan lanac i jeste. Kada se lista potroši, taj lanac ide od pivota do tačke sa najvećim uglom, a kada ga zatvorimo nazad do pivota, dobili smo omotač.

	![[graham-scan-steps.png]]

#### Implementacija

Primeti da `orientation` opet radi sav posao - jednom unutar funkcije `sort_function`, jednom unutar provere za skidanje.

GrahamScan.cpp
```c++
#include <bits/stdc++.h>

using namespace std;

struct v{

    long long x, y;
};

v sub(v a, v b){

    return {a.x - b.x, a.y - b.y};
}

long long cross(v a, v b){

    return (a.x * b.y) - (a.y * b.x);
}

char orientation(v a, v b, v c){ // gde je c u odnosu na pravu ab

    long long prod = cross(sub(b, a), sub(c, a));

    if(prod > 0){
        return '+';
    }

    if(prod < 0){
        return '-';
    }

    return '=';
}

long long dist2(v a, v b){

    long long dx = a.x - b.x, dy = a.y - b.y;

    return dx * dx + dy * dy;
}

v pivot; //svaki ugao u sortiranju se meri odavde

bool sort_function(v a, v b){

    char t = orientation(pivot, a, b);

    if(t == '='){ //isti ugao, pa bliza ide prva
        return dist2(pivot, a) < dist2(pivot, b);
    }

    return t == '+';
}

vector<v> convexHull(vector<v> p){

    int n = p.size();

    int piv = 0; //najniza, pa najlevlja
    for(int i = 1; i < n; i++){
        if(p[i].y < p[piv].y || (p[i].y == p[piv].y && p[i].x < p[piv].x)){
            piv = i;
        }
    }
    swap(p[0], p[piv]);

    pivot = p[0];
    sort(p.begin() + 1, p.end(), sort_function);

    vector<v> hull;

    for(int i = 0; i < n; i++){
        while(hull.size() >= 2 && orientation(hull[hull.size() - 2], hull.back(), p[i]) != '+'){
            hull.pop_back();
        }

        hull.push_back(p[i]);
    }

    return hull;
}

int main(){

    vector<v> p = {{0, 0}, {4, 0}, {4, 4}, {0, 4}, {2, 2}, {2, 0}, {1, 3}};

    vector<v> hull = convexHull(p);

    cout<<hull.size()<<'\n';

    for(int i = 0; i < hull.size(); i++){
        cout<<hull[i].x<<" "<<hull[i].y<<'\n';
    }

    return 0;
}
```
Output:
`4`
`0 0`
`4 0`
`4 4`
`0 4`

Četiri ugla, suprotno od kazaljke na satu. `(2, 2)` i `(1, 3)` su strogo unutra i nijednom nisu preživele proveru skretanja. `(2, 0)` stoji tačno na sredini donje stranice: bila je dodata, pa skinuta čim je stigla `(4, 0)`, jer je skretanje tamo `=` a ne `+`.

Sortiranje je ceo trošak, **O(n log n)**. Prolaz posle njega je O(n) - svaka tačka se doda jednom i skine najviše jednom.
