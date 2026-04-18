# Planer putovanja - Mobilno računarstvo

Mobilna hibridna aplikacija za planiranje i organizaciju putovanja, razvijena u okviru predmeta Mobilno računarstvo na Fakultetu organizacionih nauka.

## Opis projekta

Aplikacija omogućava korisnicima da planiraju svoja putovanja birajući države i gradove, uz detaljnu evidenciju troškova smeštaja, prevoza i termina putovanja. Centralni entitet aplikacije je **Putovanje**, koje povezuje geografske lokacije sa logističkim podacima korisnika.

Sistem je razvijen korišćenjem **Ionic** i **Angular** framework-a, dok se za skladištenje podataka i autentifikaciju koristi **Firebase Realtime Database**. Sva komunikacija sa bazom podataka realizovana je isključivo putem **REST API HTTP zahteva**.

## Funkcionalnosti

### Autentifikacija

* **Registracija i prijava:** Korisnik kreira nalog kako bi upravljao ličnim listama putovanja.
* **Firebase Auth:** Autentifikacija se vrši putem Firebase REST API-ja.

### Upravljanje putovanjima 

* **Kreiranje (Create):** Prilikom kreiranja putovanja, korisnik bira državu (iz predefinisanog menija) i unosi grad, datume (početak i kraj), vrstu i cenu prevoza, vrstu i cenu smeštaja.
* **Pregled (Read):** Prikaz svih planiranih putovanja korisnika, sa mogućnošću pregleda putovanja grupisanih po državama. Moguć pregled statistike putovanja.
* **Ažuriranje (Update):** Izmena svih parametara postojećeg putovanja.
* **Brisanje (Delete):** Uklanjanje putovanja iz baze podataka.

### Složeni slučaj korišćenja 

* **Kolaboracija korisnika:** Korisnik može dodati drugog registrovanog korisnika u svoje putovanje.
* **Zajednički pregled:** Dodati korisnik takođe dobija pravo pregleda tog putovanja.
* **Interakcija:** Omogućeno ostavljanje komentara na putovanja od strane svih učesnika povezanih sa tim putovanjem.

## Tehnologije

* **Framework:** Ionic + Angular
* **Baza podataka:** Firebase Realtime Database
* **Komunikacija:** REST API (HTTP klijent)
* **Verzionisanje koda:** Git / GitHub

## Autori

* Jovana Grujić 2022/0376
* Ana Dobrijević 2022/0032