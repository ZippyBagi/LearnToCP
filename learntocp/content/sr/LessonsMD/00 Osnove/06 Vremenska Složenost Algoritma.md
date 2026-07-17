> U ovoj lekciji fokusiraćemo se na razumevanje vremenske složenosti i kako da razmišljamo o njoj prilikom rešavanja problema.

Jedan od najčešćih problema u takmičarskom programiranju jeste situacija kada imamo potpuno tačno rešenje, ali ono ipak pada zbog **TLE-a (Time Limit Exceeded)**.

Da bismo razumeli zašto se to dešava i kako da rešimo problem, moramo razumeti **vremensku složenost** algoritma.

Formalnije rečeno:

> Vremenska složenost opisuje kako vreme izvršavanja algoritma raste u odnosu na veličinu ulaza.

Većina algoritama koje pišemo može se svrstati u neku od sledećih kategorija:

- `O(1)` - algoritam radi istom brzinom bez obzira na veličinu ulaza
- `O(n)` - vreme izvršavanja raste linearno sa veličinom ulaza
- `O(n log n)` - linearno-logaritamska složenost
- `O(n^2)` - kvadratna složenost, uglavnom prihvatljiva samo za manje ulaze ili veće vremenske limite
- `O(n!), O(n^n), O(2^n)` - eksponencijalne (ili još gora) složenosti
![[big-o.jpg]]
Za većinu problema O(n log n) je dovoljna složenost

### Brojanje operacija

U gruboj proceni možemo posmatrati svaku osnovnu operaciju kao konstantno vreme izvršavanja.  
Drugim rečima - jedna linija koda ≈ jedna operacija.

Kod petlji stvari postaju zanimljivije, jer se sve operacije unutar njih ponavljaju onoliko puta koliko se petlja izvršava.

Na primeru će ovo biti mnogo jasnije:

Solution.cpp
```c++
int main(){

	cin.tie(0);  
	ios_base::sync_with_stdio(false);
	
	int n;
	cin>>n; //jedna operacija
	
	int sum =0;
	for(int i=0;i<n;i++){ //spoljašnja petlja se izvršava n puta
		for(int j=0;j<n;j++){ //unutrašnja petlja se takođe izvršava n puta
		
			sum++; //jedna operacija
		
		}
	}
	
	cout<<sum;

	return 0;
}
```

`Input: 5`  
`Output: 25`

Ako pogledamo input i output, prilično je jasno da ovaj kod radi u `O(n^2)` složenosti.

> Kada procenjujemo složenost, uglavnom nas zanimaju delovi koda koji se ponavljaju, dok konstante uglavnom ignorišemo. Zato naš kod, iz ugla složenosti, zapravo izgleda ovako:

~!
```c++
int main(){
	for(int i=0;i<n;i++){
		for(int j=0;j<n;j++){
		}
	}
}
```

U ovom primeru je bilo lako prepoznati složenost, ali u praksi to često neće biti toliko očigledno.

I to je sasvim u redu - gotovo nikada nije potrebno izračunati potpuno tačnu složenost.  Dovoljna je dobra i razumna procena.
### Primena

Kako znamo koja složenost je prihvatljiva za određeni zadatak?

Obratite pažnju na dve stvari:

1. vremenski limit
2. veličinu ulaza

Jedno često pravilo u c++-u jeste da računar može da izvrši oko `10^8` (100 miliona) operacija u sekundi  
(ovo može varirati u zavisnosti od kompajlera i sistema).

Zato obično uzimamo:

- najveću moguću veličinu ulaza
- procenu složenosti algoritma

i proverimo da li broj operacija ostaje unutar vremenskog limita.

Ako ne ostaje - potrebno je optimizovati rešenje.

> Kako budete rešavali zadatke, vremenom ćete razviti osećaj za to koja složenost prolazi za koji tip problema, čak i bez računanja.