> U ovoj lekciji naučićemo kako se koncepti poput if naredbi, for petlji i poređenja pišu u c++-u

### Uslovi:

1. If naredbe
	If naredbe predstavljaju osnovne gradivne elemente našeg koda. Pišu se ovako: `if(condition){}`, na primer:

```c++
int main(){ 
	int a = 3;
	
	if(a > 3){
		cout<<"a je veće od 3";
	}
	return 0;
}
```

2. Else
Ovaj blok koda se izvršava ukoliko uslov iz `if` naredbe nije ispunjen: `if(condition){}else{}`

```c++
int main(){ 
	int a;
	cin>>a;
	
	if(a > 3){
		cout<<"a je veće od 3";
	}else{
		cout<<"a nije veće od 3";
	}
	return 0;
}
```

3. Else if
Možemo kombinovati više uslova pomoću `else if` blokova: `if(condition){} else if(condition2){}`

```c++
int main(){ 
	int a;
	cin>>a;
	
	if(a > 10){
		cout<<"a je veće od 10";
	}else if(a > 5){
		cout<<"a nije veće od 10, ali jeste veće od 5";
	}else if(a > 2){
		cout<<"a nije veće od 5, ali jeste veće od 2";
	}else{
		cout<<"a nije veće od 2";
	}
	return 0;
}
```

### Poređenje:

Kada pišemo uslove za `if` naredbe, potrebno je da koristimo operatore poređenja između dve vrednosti (poput `>` u `if(a>2)`).

Ovo su svi operatori poređenja koje koristimo:

- `if (a > b)` - da li je **a** veće od **b**
- `if (a < b)` - da li je **a** manje od **b**
- `if (a >= b)` - da li je **a** veće ili jednako **b**
- `if (a <= b)` - da li je **a** manje ili jednako **b**
- `if (a == b)` - da li je **a** jednako **b**
- `if (a != b)` - da li se **a** razlikuje od **b**

Operator negacije `!` takođe možemo koristiti ispred drugih izraza:

~!
```c++
int main(){ 
	int a;
	cin>>a;
	
	if(!(a > 3)){
		cout<<"a nije veće od 3";
	}
	return 0;
}
```

Takođe možemo direktno koristiti promenljive ukoliko su boolean tipa (`bool`)  
(tehnički ovo radi i za druge tipove podataka, ali se smatra lošom praksom):

~!
```c++
int main(){ 
	bool a = true;
	
	if(a){
		cout<<"a je true";
	}
	return 0;
}
```

### Petlje:

> Petlje ponavljaju kod unutar sebe sve dok određeni uslov važi

U c++-u postoje dve glavne vrste petlji: `while()` i `for()`.  
U većini slučajeva mogu se koristiti za iste stvari.

1. While petlje

Pišu se ovako: `while(condition)`  

Sve dok je uslov tačan, petlja će nastaviti da se izvršava.

Primer:

~!
```c++
int main(){ 
	int i = 0; //inicijalizujemo brojač
	
	while(i < 10){ //dok je i manje od 10 petlja se ponavlja
		
		cout<<i<<" ";
		i++; //moramo povećavati brojač kako bismo izbegli beskonačnu petlju
	}
	return 0;
}
```

`Output: 0 1 2 3 4 5 6 7 8 9`

2. For petlje

For petlje pišu se ovako: `for(int i=0;i<n;i++)`

Ovde se dešava nekoliko stvari:

- `for()` - pokreće petlju
- `int i=0;` - kreira novu promenljivu `i` i postavlja njenu početnu vrednost na 0
- `i < n;` - najvažniji deo petlje, određuje koliko dugo će se petlja izvršavati, možemo ga posmatrati kao: **dok je `i` manje od `n`**
- `i++` - izvršava se nakon svake iteracije i povećava vrednost promenljive `i` za 1

Primer:

~!
```c++
int main(){ 
	for(int i=0; i<10;i++){
		cout<<i<<" ";
	}
}
```

`Output: 0 1 2 3 4 5 6 7 8 9`