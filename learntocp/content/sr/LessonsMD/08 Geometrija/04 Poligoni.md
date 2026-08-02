>U ovoj lekciji prestajemo da gledamo po dve tačke i prelazimo na cele oblike.

**Poligon** je zatvoren lanac tačaka. Čuvamo ga kao `vector` tačaka, redom kojim ga obilazimo, a poslednja tačka se spaja sa prvom - tu poslednju stranicu nigde ne zapisujemo, samo pamtimo da postoji.

### Osnovno

Dve reči koje ćemo stalno koristiti:

- poligon je **prost** kada mu se stranice nigde ne seku. Cela ova lekcija podrazumeva prost poligon.
- poligon je **konveksan** kada nema udubljenja - dok ga obilazimo, uvek skrećemo na istu stranu. Sve ostalo je konkavno.

Tačke mogu da budu date u smeru kazaljke na satu ili suprotno, i oba redosleda crtaju isti oblik. To ipak nije nebitan podatak, a sledeća sekcija nam ga daje besplatno.

### Površina

Jedna formula daje površinu bilo kog prostog poligona, konveksnog ili ne, a sagrađena je od vektorskih proizvoda koje već imamo. Zove se **formula pertle** (en. shoelace formula):

$$2 \cdot P = \sum_{i=0}^{n-1} (x_i \, y_{i+1} - x_{i+1} \, y_i)$$

gde se indeks `n` vraća na `0`. Svaki sabirak je vektorski proizvod dve susedne tačke, uzete kao vektori iz koordinatnog početka.

	![[shoelace-lacing.png]]

>Ime dolazi od slike: proizvodi se ukrštaju između dva reda isto kao pertle na cipeli.

Dve stvari vredi primetiti. Zbir je **dvostruka** površina, i uvek je ceo broj, pa ostaje tačan u tipu `long long`. I ima **znak** - pozitivan je kada su tačke date suprotno od kazaljke na satu, a negativan kada su date u smeru kazaljke. Jedna petlja, dva odgovora.

Shoelace.cpp
```c++
#include <bits/stdc++.h>

using namespace std;

struct v{

    long long x, y;
};

long long cross(v a, v b){

    return (a.x * b.y) - (a.y * b.x);
}

long long doubledArea(vector<v> p){

    long long sum = 0;

    for(int i = 0; i < p.size(); i++){
        int j = (i + 1) % p.size(); //poslednja tacka se vraca na prvu

        sum += cross(p[i], p[j]);
    }

    return sum;
}

int main(){

    vector<v> p = {{0, 0}, {4, 0}, {4, 3}, {1, 3}};

    long long d = doubledArea(p);

    cout<<d<<'\n';
    cout<<d / 2.0<<'\n';

    reverse(p.begin(), p.end()); //isti oblik, obidjen u suprotnom smeru
    cout<<doubledArea(p)<<'\n';

    return 0;
}
```
Output:
`21`
`10.5`
`-21`

>Čuvaj dvostruku vrednost i podeli je na pola tek kada ti stvarno treba realan broj. `21` je tačno, `21 / 2` u celim brojevima je `10`, a znak je smer kojim smo obišli poligon.

Svaki isečak koda odavde nadalje pretpostavlja da su `v`, `cross` i `orientation` iz prethodne lekcije već napisani iznad njega.
### Da li je poligon konveksan

Obiđimo poligon i gledajmo skretanje u svakom uglu. U konveksnom poligonu uvek skrećemo na istu stranu - ili sve levo, ili sve desno. Prvi ugao koji skrene na drugu stranu je udubljenje.

Tri tačke u nizu su tačno ono što `orientation` prima, pa je skretanje u jednom uglu `orientation` tog ugla zajedno sa njegova dva suseda. Nikada nas ne zanima da li je odgovor `+` ili `-`, samo da se ne menja - i baš zato ovo radi za oba smera obilaska bez ikakve pripreme.

Dva detalja. Trojke se vrte u krug, pa poslednja dva ugla uzimaju svoje susede sa početka vektora. I `=` znači tri tačke na istoj pravoj, što uopšte nije skretanje - preskakanje takvih čuva konveksnost poligona koji ima ravnu stranicu.

	![[polygon-turn-signs.png]]

Convex.cpp
```c++
bool isConvex(vector<v> p){

    char turn = '=';

    for(int i = 0; i < p.size(); i++){
        int j = (i + 1) % p.size();
        int k = (i + 2) % p.size();

        char o = orientation(p[i], p[j], p[k]);

        if(o == '='){ //tri tacke u nizu, nema skretanja
            continue;
        }

        if(turn == '='){ //prvo pravo skretanje odredjuje smer
            turn = o;
        }
        else if(o != turn){
            return false;
        }
    }

    return true;
}

int main(){

    vector<v> square = {{0, 0}, {4, 0}, {4, 4}, {0, 4}};
    vector<v> arrow = {{0, 0}, {4, 0}, {4, 4}, {2, 1}, {0, 4}};
    vector<v> flat = {{0, 0}, {2, 0}, {4, 0}, {4, 4}, {0, 4}};

    cout<<isConvex(square)<<'\n';
    cout<<isConvex(arrow)<<'\n';
    cout<<isConvex(flat)<<'\n';

    return 0;
}
```
Output:
`1`
`0`
`1`

Strelica ima ugao gurnut ka unutra u tački `(2, 1)`, i baš to skretanje se vraća kao `-`, dok su sva ostala `+`. Treći oblik je opet kvadrat, sa dodatnim uglom na sredini donje stranice: taj ugao vraća `=`, biva preskočen, i odgovor ostaje `1`.

>Provera skretanja ne govori ništa o tome da li je poligon prost. Petokraka zvezda skreće na istu stranu u svakom svom uglu a ipak preseca samu sebe, pa kada zadatak ne garantuje prost poligon, to moraš proveriti posebno.

### Rezime

| Pitanje                        | Provera                                  |
| ------------------------------ | ---------------------------------------- |
| Površina poligona              | zbir po formuli pertle, prepolovljen     |
| Kojim smerom su tačke date     | znak zbira po formuli pertle             |
| Da li je poligon konveksan     | sva skretanja imaju isti znak            |
