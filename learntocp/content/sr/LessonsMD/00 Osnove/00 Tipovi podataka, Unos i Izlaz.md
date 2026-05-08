> Ova lekcija će pretpostaviti da **nemate nikakvo prethodno znanje iz c++-a**

U kontekstu takmičarskog programiranja, svaki program će otprilike izgledati ovako:

Solution.cpp
```c++
#include <bits/stdc++.h> // - Prvo uključujemo biblioteke koje ćemo koristiti (više o ovome kasnije)

using namespace std; // Takođe uključujemo std namespace, ovo nam omogućava da koristimo stvari poput standardnog sistema za unos/izlaz

// Ovde je naša main funkcija, sav kod počinje da se izvršava odavde
int main(){ 

	// logika ide ovde

	return 0;
}
```
Stvar na koju treba obratiti pažnju je `return 0` na kraju naše main funkcije, veoma je važan jer bez njega neki online judge sistemi neće prihvatiti rešenje čak i ako je tačno.

### Tipovi podataka:

U c++-u, imamo nekoliko osnovnih tipova podataka sa kojima bi trebalo da budete upoznati, a to su:

- **int** - za standardne cele brojeve (32 bit)    
- **long long** - za velike cele brojeve (64 bit)
- **char** - za jedan karakter sa tastature (na primer `'a'`)
- **string** - za tekst
- **float** - za decimalne brojeve
- **bool** - za boolean vrednosti (mogu biti ili true ili false)

Naravno postoji još mnogo njih koji imaju specifične svrhe, ali doći ćemo do njih kasnije
### Unos/Izlaz

> Kada rešavate problem, većinu vremena će postojati oznaka **"Standard Input/Output"** ili **"Standard I/O"** unutar problema. Ovo znači da uzimamo informacije iz konzole i ispisujemo ih u konzolu.

Postoje dva načina da se ovo uradi u c++-u:
#### 1. scanf() i printf();

> Ovo je metoda preneta iz programskog jezika c.

Ovo izgleda strašno i komplikovano ali nije toliko loše koliko izgleda:

Za unos koristimo `scanf("%d", &a)`:
- Prvo `scanf()` poziva funkciju za unos    
- `%` znači da želimo da unesemo nešto
- `d` u `%d` znači da želimo da unesemo **float (ceo broj)** (svaki tip podataka ima svoj kod)
- Zatim dolazi `&a`, za sada možete razmišljati o tome kao da želimo da stavimo unetu vrednost **u a**  
Kada se spoji izgleda ovako:  
~!
```c++
int main(){ 

	int a; //prvo inicijalizujemo a
	scanf("%d", &a); //zatim čitamo vrednost i stavljamo je u a

	return 0;
}
```

Za izlaz je veoma slično `printf("%d", a)`:

- `printf()` poziva funkciju
- `%` znači da želimo da ispišemo vrednost
- `%d` znači da želimo da ispišemo ceo broj
- I `a` je vrednost koju ispisujemo (Primetite da ispisujemo **`a`** a **NE `&a`** )

Dobra stvar kod `printf()` je što možemo staviti tekst pre i posle `%d`  
~!
```c++
int main(){ 

	int a = 13;
	
	printf("Vrednost a je %d!", a);

	return 0;
}
```

Output: `Vrednost a je %d!`

Ovde su kodovi za sve tipove podataka:

- **int** - `%d`
- **long long** - `%ll`
- **char** - `"%c"`
- **string** - `%s`
- **float** - `%f`
- **bool** - `%b`

#### 2. cin>> i cout<<;

> Ovo je noviji i po mom mišljenju jednostavniji pristup.

Za unos koristimo `cin>>a`:
- `cin>>` znači da želimo da unesemo nešto
- `a` znači da ono što dobijemo iz konzole stavljamo u `a`  
~!
```c++
int main(){ 

	int a; //prvo inicijalizujemo a
	cin>>a;

	return 0;
}
```

Takođe možemo uneti više promenljivih odjednom ovako: `cin>>a>>b;`

Za izlaz koristimo `cout<<a`:
- `cout<<` poziva ispis
- `a` znači vrednost promenljive a

Ako želimo da ispišemo više stvari pišemo `cout<<a<<b;`  
~!
```c++
int main(){ 

	int a = 13;
	
	cout<<"Vrednost a je: "<<a<<"!";

	return 0;
}
```
Output: `Vrednost a je: 13!`

> Jedna stvar koju treba primetiti kada koristimo `cin` i `cout` je da su oni **SPORIJI** od `scanf`-a i `printf`-a (više o ovome kasnije)

Da bismo ih ubrzali moramo napisati ove dve linije na početku naše main funkcije:  
`cin.tie(0);`  
`ios_base::sync_with_stdio(false);`

Tako da ceo kod izgledao ovako:

Solution.cpp
```c++
#include <bits/stdc++.h>

using namespace std;
int main(){ 
	
	cin.tie(0);
	ios_base::sync_with_stdio(false);
	
	int a;
	cin>>a;
	
	cout<<"Vrednost a je: "<<a<<"!";

	return 0;
}
```

> Napomena : ove dve linije mogu biti zbunjujuće i često nisu neophodne, ali je dobro pisati ih u svakom rešenju koje koristi cin i cout. Zato ćete ih viđati u većini lekcija

Saznajte više o njima ovde: [https://stackoverflow.com/questions/31162367/significance-of-ios-basesync-with-stdiofalse-cin-tienull](https://stackoverflow.com/questions/31162367/significance-of-ios-basesync-with-stdiofalse-cin-tienull)