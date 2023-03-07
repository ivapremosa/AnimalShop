# AnimalShop
## Opis sistema

AnimalShop je informacijski sistem in vključuje tri mikrostoritve in spletno aplikacijo kot uporabniški vmesnik. Sistem je namenjen lastnikima živali in ponuja vse potrebno za hišne ljubljenčke. Mikrostoritve so namenjene za upravljanje z izdelkima, naročilo in avtentifikaciji uporabnikov. Vsaka mikrostoritev ima svojo podatkovno bazo v katero shranjuje podakte.

---
Mikrostoritve so razdeljene na:
* Mikrostoritev za avtentikacijo <br />
    Zagotavlja API za registracijo, prijavo in ponastavitev gesla. Uporabnike shranjuje v podatkovno bazo in uporablja šifriranje in sol za varnost gesel.

* Mikrostoritev za naročilo <br />
Zagotavlja API za ustvarjanje, brisanje in posodabljanje naročil. 

* Mikrosoritev za katalog izdelkov <br />
Zagotavlja API za dodajanje, posodabljanje in brisanje izdelkov. 

---

Spletna aplikacija komunicira z mikrostoritvami preko njegovih API-jev in uporabnikom omogoča dostop do sistema.

