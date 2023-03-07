# UserService
## Mikrostoritev za obdelavo naročil
___

![Screenshot](/microservices/OrderService/OrderService.png "Organized Layerd using DDD")

___

* Funkcionalne zahteve
    * Ustvaranje naročil: Mikrostoritev mora omogočati uporabnikom, da ustvarijo naročilo.
    * Preverjanje zaloge: Mikrostoritev mora preveriti stanje zaloge, preden potrdi naročilo.
    * Posodabljanje naročil: Mikrostoritev mora omogočati uporabnikom, da posodobijo naročilo.
    * Obdelava naročila: Mikrostoritev mora obdelati naročilo in ga poslati na ustrezen naslov za dostavo.
    

* Nefunkcionalne zahteve
    * Mikrostoritev mora biti sposobna obvladati vsaj 1000 zahtev na sekundo.
    * Vsaka zahteva mora biti obdelana v manj kot 10 sekund.
    * Zaloga mora biti preverjanja vsaj v 1 uri od naročila. 

___
    



