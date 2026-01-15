# Architektura i Wzorce Projektowe

Poniższa sekcja opisuje wzorce projektowe zaimplementowane w systemie, z podziałem na warstwy architektoniczne oraz kategorie funkcjonalne.

## 1. Wzorce Prezentacji Internetowych (Web Presentation Patterns)

### Model View Controller (MVC)

* **Klasy:** `ExhibitController`, `AuthController`, `ExhibitService` (Model), Aplikacja React (View).
* **Uzasadnienie:** Fundamentalny wzorzec architektury Spring Web MVC. Separuje logikę biznesową i dane (Backend/Model) od warstwy prezentacji (Frontend/View) oraz sterowania przepływem (Controller).
* **Korzyści:**
  * **Niezależność rozwoju:** Zespół frontendowy (React) i backendowy (Java) mogą pracować równolegle, uzgadniając jedynie kontrakt API.
  * **Łatwiejsze utrzymanie:** Zmiana technologii widoku (np. z React na Angular) nie wymaga ingerencji w logikę biznesową po stronie serwera.



### Record Set (Zbiór Rekordów)

* **Klasy:** `Catalog.tsx` (React Component), `exhibitService.ts`, obiekt stanu `allExhibits`.
* **Uzasadnienie:** Aplikacja pobiera pełną listę eksponatów z API i przechowuje ją w pamięci przeglądarki jako zbiór danych. Operacje filtrowania i sortowania wykonywane są bezpośrednio na tym zbiorze po stronie klienta (Client-Side).
* **Korzyści:**
  * **Wydajność interfejsu (Zero Latency):** Filtrowanie i sortowanie odbywa się natychmiastowo, bez opóźnień sieciowych, co poprawia User Experience (UX).
  * **Redukcja obciążenia serwera:** Zamiast wysyłać zapytanie do bazy przy każdym kliknięciu filtra, serwer obsługuje tylko jedno żądanie pobrania danych na sesję.



---

## 2. Wzorce Logiki Dziedziny (Domain Logic Patterns)

### Service Layer (Warstwa Usług)

* **Klasy:** `ExhibitService`, `ReservationService`, `AuthService`.
* **Uzasadnienie:** Wydzielona warstwa usług definiuje granicę aplikacji i zestaw dostępnych operacji. Pośredniczy ona między kontrolerami a warstwą danych.
* **Korzyści:**
  * **Centralizacja logiki:** Reguły biznesowe (np. walidacja dostępności terminu) znajdują się w jednym miejscu, a nie są rozrzucone po kontrolerach.
  * **Reużywalność:** Tę samą metodę serwisu może wywołać kontroler REST, zadanie w tle (Scheduler) lub inny serwis.



### Domain Model (Model Domeny)

* **Klasy:** `Exhibit`, `User`, `Reservation`, `Exhibition`.
* **Uzasadnienie:** Encje w systemie nie są jedynie kontenerami na dane, lecz reprezentują realne obiekty biznesowe oraz relacje między nimi.
* **Korzyści:**
  * **Zrozumiałość kodu:** Kod odzwierciedla rzeczywisty język biznesowy (Ubiquitous Language), co ułatwia komunikację i zrozumienie zasad działania systemu.
  * **Enkapsulacja:** Model dba o spójność swoich danych (np. poprzez walidację w setterach lub konstruktorach).



### Transaction Script (Skrypt Transakcyjny)

* **Klasy:** `ReservationService` (metoda `makeReservation`).
* **Uzasadnienie:** Metoda tworzenia rezerwacji realizuje ten wzorzec poprzez wykonanie proceduralnego ciągu kroków niezbędnych do sfinalizowania operacji biznesowej (sprawdzenie dostępności -> pobranie usera -> zapis).
* **Korzyści:**
  * **Prostota:** Idealny dla operacji o niskiej i średniej złożoności – kod jest liniowy, łatwy do napisania i prześledzenia "krok po kroku".
  * **Szybkość implementacji:** Nie wymaga tworzenia skomplikowanych struktur obiektowych dla prostych operacji CRUD.



---

## 3. Wzorce Architektury Źródła Danych (Data Source Architecture Patterns)

### Repository (Repozytorium)

* **Klasy:** `ExhibitRepository`, `UserRepository`, `ReservationRepository`.
* **Uzasadnienie:** Interfejsy te ukrywają szczegóły techniczne dostępu do źródła danych, emulując kolekcję obiektów w pamięci.
* **Korzyści:**
  * **Testowalność:** Umożliwia łatwe "mockowanie" warstwy danych w testach jednostkowych serwisów (nie trzeba stawiać prawdziwej bazy danych do testów).
  * **Czystość kodu:** Warstwa biznesowa nie zawiera kodu SQL ani szczegółów połączenia z bazą.



### Data Mapper

* **Klasy:** Hibernate (implementacja JPA używana przez Spring Data).
* **Uzasadnienie:** Wzorzec ten separuje obiekty w pamięci (Encje) od fizycznej struktury relacyjnej bazy danych, tłumacząc operacje obiektowe na SQL.
* **Korzyści:**
  * **Niezależność od bazy danych:** Aplikacja może łatwo zmienić silnik bazy danych (np. z PostgreSQL na MySQL) bez konieczności przepisywania zapytań SQL w kodzie.
  * **Produktywność:** Programista skupia się na logice Java, a nie na ręcznym mapowaniu kolumn `ResultSet` na pola obiektów.



---

## 4. Wzorce Odwzorowań Obiektów i Metadanych

### Query Object (Obiekt Zapytania)

* **Klasy:** `ExhibitSearchCriteria`, `ExhibitController`, `ExhibitService`.
* **Uzasadnienie:** Zamiast przekazywać wiele pojedynczych parametrów do metod serwisu, kryteria wyszukiwania zostały zgrupowane w jedną klasę `ExhibitSearchCriteria`.
* **Korzyści:**
  * **Czystość kodu (Clean Code):** Sygnatury metod pozostają krótkie i czytelne niezależnie od liczby filtrów.
  * **Łatwa rozbudowa:** Dodanie nowego filtra (np. "data od") wymaga jedynie dodania pola w klasie kryteriów, bez łamania kompatybilności wstecznej metod w kontrolerach i serwisach.



---

## 5. Wzorce Struktury Mapowania Obiektowo-Relacyjnego

### Identity Field (Pole Identyfikujące)

* **Klasy:** Pola oznaczone adnotacją `@Id` (np. `Long id` w klasie `Exhibit`).
* **Uzasadnienie:** Każdy obiekt trwały posiada unikalny identyfikator, pozwalający odróżnić go od innych instancji.
* **Korzyści:**
  * **Spójność danych:** Pozwala jednoznacznie zidentyfikować wiersz w bazie danych, co jest kluczowe przy aktualizacjach i relacjach, nawet jeśli inne dane obiektu ulegną zmianie.



### Foreign Key Mapping (Mapowanie Klucza Obcego)

* **Klasy:** Relacje `@ManyToOne` (np. w `Reservation` do `User`) oraz `@OneToMany`.
* **Uzasadnienie:** Wzorzec ten odwzorowuje relacje między tabelami w bazie danych (klucze obce) na referencje między obiektami w języku Java.
* **Korzyści:**
  * **Intuicyjna nawigacja:** Umożliwia programiście poruszanie się po grafie obiektów w naturalny sposób (np. `reservation.getUser().getEmail()`) bez ręcznego pisania zapytań typu JOIN.



---

## 6. Wzorce Podstawowe (Base Patterns)

### Gateway (Brama)

* **Klasy:** Frontend: Konfiguracja Axios / `exhibitService.ts`. Backend: `JpaRepository`.
* **Uzasadnienie:** Obiekt, który encapsuluje dostęp do zewnętrznego systemu lub zasobu (API REST lub Bazy Danych).
* **Korzyści:**
  * **Ukrycie złożoności:** Klient (np. komponent Reacta) nie musi wiedzieć, jak skonfigurować nagłówki HTTP czy obsłużyć błędy sieciowe – wywołuje prostą metodę `getAll()`.
  * **Łatwa wymiana:** Jeśli zmieni się adres API lub sposób autoryzacji, zmiany wprowadzamy tylko w jednym miejscu (w Bramie), a nie w całej aplikacji.



### Separated Interface (Wydzielony Interfejs)

* **Klasy:** `JwtAuthenticationFilter`, `UserDetailsService` (Spring Security).
* **Uzasadnienie:** Logika uwierzytelniania zależy od abstrakcyjnego interfejsu `UserDetailsService`, a nie od konkretnej implementacji klasy użytkownika.
* **Korzyści:**
  * **Luźne powiązania (Loose Coupling):** Implementacja ładowania użytkownika może zostać całkowicie wymieniona (np. z bazy SQL na usługę LDAP) bez konieczności zmiany ani jednej linijki kodu w filtrze uwierzytelniającym.