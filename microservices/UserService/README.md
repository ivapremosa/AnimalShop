# UserService
## Mikrostoritev za avtentikacijo uporabnikov
___

![Screenshot](/microservices/UserService.png "Organized Layerd using DDD")

___

* Funkcionalne zahteve
    * Registracija uporabnika: Uporabnik se lahko registrira z imenom, emailom in geslom.  
    * Prijava uporabnika: Uporabnik se lahko prijavi z emailom in geslom in ima dostop do svojega računa.
    * Mikrostoritev mora zagotavljati zaščito gesel z pomočjo šifriranja in soli.
    * Uporabnik lahko ureja svoj profil in uredi svoje podatke in informacije.
    * Mikroservis mora biti enostaven za uporabo.

* Nefunkcionalne zahteve
    * Mikrostoritev mora biti sposobna obvladati vsaj 1000 zahtev na sekundo.
    * Vsaka zahteva mora biti obdelana v manj kot 10 sekund.

___
    



