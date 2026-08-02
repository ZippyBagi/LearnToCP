>U ovoj lekciji učimo kako da množimo vektore - i zašto je to zaista korisno

### Skalarni proizvod

Skalarni proizvod je prvi način na koji možemo da pomnožimo vektore. Piše se kao $\vec{A} \cdot \vec{B}$

Računa se ovako:  $$\vec{A} \cdot \vec{B} = \vec{A}_x * \vec{B}_x + \vec{A}_y * \vec{B}_y$$
Koristan je zato što nam govori da li su dva vektora **normalna jedan na drugi**.

#### Normalni vektori

Normalni vektori su vektori koji zaklapaju **ugao od 90°**

Ako je skalarni proizvod 2 vektora `0`, onda su oni normalni jedan na drugi.

	![[dot-product-normal.png]]

#### Implementacija
Pretpostavimo da su svi vektori implementirani ovako: 
~!
```c++
struct v{
	long long x;
	long long y;
};
```

Skalarni proizvod je:
~!
```c++
int dot_product(v a, v b){
    return (a.x * b.x) + (a.y * b.y);
}
```

### Vektorski proizvod

Drugi, i korisniji način množenja je vektorski proizvod.

Pomoću njega možemo da izračunamo da li je poligon konveksan ili nije, da li su dva vektora paralelna, da li se dva vektora seku, i tako dalje..

Vektorski proizvod za dva 2D vektora svodi se na računanje determinante njihovih koordinata. Piše se kao $A \times B$

Što znači:

$$\vec{A} \times \vec{B} = \vec{A}_x * \vec{B}_y - \vec{A}_y * \vec{B}_x$$
Znak vektorskog proizvoda nam govori gde se dva vektora nalaze jedan u odnosu na drugi.

#### Čitanje vektorskog proizvoda

Zamisli da vektori seku krug.

Kada izračunamo vektorski proizvod $\vec{A} \times \vec{B}$, ako je proizvod **pozitivan**, onda se po krugu, da bismo stigli od $\vec{A}$ do $\vec{B}$, krećemo suprotno od kazaljke na satu.

Ako je proizvod **negativan**, da bismo stigli od $\vec{A}$ do $\vec{B}$, krećemo se u smeru kazaljke na satu.

Ako je proizvod `0`, onda su $\vec{A}$ i $\vec{B}$ **paralelni**!

	![[cross-product-circle.png]]

#### Implementacija

```c++
int cross_product(v a, v b){

    return (a.x * b.y) - (a.y * b.x);
}
```
