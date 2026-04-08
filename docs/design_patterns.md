# Architecture and Design Patterns

The following section describes the design patterns implemented within the system, categorized by architectural layers and functional domains.

## 1. Web Presentation Patterns

### Model-View-Controller (MVC)
* **Classes:** `ExhibitController`, `AuthController`, `ExhibitService` (Model), React Application (View).
* **Justification:** The fundamental architectural pattern of Spring Web MVC. It separates business logic and data (Backend/Model) from the presentation layer (Frontend/View) and request routing (Controller).
* **Benefits:**
  * **Independent Development:** The frontend team (React) and backend team (Java) can work in parallel, needing only to agree on the API contract.
  * **Maintainability:** Changing the view technology (e.g., migrating from React to Angular) does not require any modifications to the server-side business logic.

### Record Set
* **Classes:** `Catalog.tsx` (React Component), `exhibitService.ts`, state object `allExhibits`.
* **Justification:** The application fetches the complete list of exhibits from the API and stores it in the browser's memory as a dataset. Filtering and sorting operations are executed directly on this set on the Client-Side.
* **Benefits:**
  * **UI Performance (Zero Latency):** Filtering and sorting occur instantly without network delays, significantly enhancing User Experience (UX).
  * **Reduced Server Load:** Instead of querying the database on every filter click, the server handles only one initial data fetch request per session.

---

## 2. Domain Logic Patterns

### Service Layer
* **Classes:** `ExhibitService`, `ReservationService`, `AuthService`.
* **Justification:** A dedicated service layer defines the application's boundary and its set of available operations. It acts as a mediator between controllers and the data access layer.
* **Benefits:**
  * **Centralized Logic:** Business rules (e.g., verifying time slot availability) are encapsulated in one place rather than scattered across controllers.
  * **Reusability:** The same service method can be invoked by a REST controller, a background task (Scheduler), or another service.

### Domain Model
* **Classes:** `Exhibit`, `User`, `Reservation`, `Exhibition`.
* **Justification:** Entities in the system are not merely data containers; they represent real business objects and the relationships between them.
* **Benefits:**
  * **Code Comprehensibility:** The code reflects real-world business terminology (Ubiquitous Language), making it easier to communicate and understand system behaviors.
  * **Encapsulation:** The model ensures its own data consistency (e.g., through validation in setters or constructors).

### Transaction Script
* **Classes:** `ReservationService` (`makeReservation` method).
* **Justification:** The reservation creation method implements this pattern by executing a procedural sequence of steps required to finalize a business transaction (check availability -> fetch user -> save).
* **Benefits:**
  * **Simplicity:** Ideal for operations of low to medium complexity—the code is linear, easy to write, and simple to debug step-by-step.
  * **Speed of Implementation:** Avoids the overhead of creating complex object structures for standard CRUD operations.

---

## 3. Data Source Architecture Patterns

### Repository
* **Classes:** `ExhibitRepository`, `UserRepository`, `ReservationRepository`.
* **Justification:** These interfaces hide the technical details of data access, emulating an in-memory collection of objects.
* **Benefits:**
  * **Testability:** Allows for easy mocking of the data layer in unit tests for services (no need to spin up a real database for testing).
  * **Clean Architecture:** The business layer remains completely agnostic of SQL queries or database connection details.

### Data Mapper
* **Classes:** Hibernate (JPA implementation used by Spring Data).
* **Justification:** This pattern separates in-memory objects (Entities) from the physical relational database structure, translating object-oriented operations into SQL.
* **Benefits:**
  * **Database Independence:** The application can easily switch database engines (e.g., from PostgreSQL to MySQL) without rewriting raw SQL queries in the codebase.
  * **Developer Productivity:** Developers can focus on Java logic rather than manually mapping `ResultSet` columns to object fields.

---

## 4. Object and Metadata Mapping Patterns

### Query Object
* **Classes:** `ExhibitSearchCriteria`, `ExhibitController`, `ExhibitService`.
* **Justification:** Instead of passing multiple individual parameters to service methods, search criteria are grouped into a single `ExhibitSearchCriteria` class.
* **Benefits:**
  * **Clean Code:** Method signatures remain short and readable regardless of the number of active filters.
  * **Extensibility:** Adding a new filter (e.g., "date from") only requires adding a field to the criteria class, ensuring backward compatibility of methods in controllers and services.

---

## 5. Object-Relational Mapping Structure Patterns

### Identity Field
* **Classes:** Fields marked with the `@Id` annotation (e.g., `Long id` in the `Exhibit` class).
* **Justification:** Every persistent object has a unique identifier, allowing it to be distinguished from other instances.
* **Benefits:**
  * **Data Consistency:** Uniquely identifies a database row, which is critical for updates and maintaining relationships, even if the object's other data changes.

### Foreign Key Mapping
* **Classes:** `@ManyToOne` (e.g., in `Reservation` to `User`) and `@OneToMany` relationships.
* **Justification:** This pattern maps database table relationships (foreign keys) to object references in Java.
* **Benefits:**
  * **Intuitive Navigation:** Allows developers to traverse the object graph naturally (e.g., `reservation.getUser().getEmail()`) without manually writing JOIN queries.

---

## 6. Base Patterns

### Gateway
* **Classes:** Frontend: Axios configuration / `exhibitService.ts`. Backend: `JpaRepository`.
* **Justification:** An object that encapsulates access to an external system or resource (REST API or Database).
* **Benefits:**
  * **Complexity Hiding:** The client (e.g., a React component) doesn't need to know how to configure HTTP headers or handle network errors—it simply calls `getAll()`.
  * **Easy Replacement:** If the API URL or authorization method changes, updates are made in only one place (the Gateway).

### Separated Interface
* **Classes:** `JwtAuthenticationFilter`, `UserDetailsService` (Spring Security).
* **Justification:** Authentication logic depends on an abstract interface (`UserDetailsService`) rather than a concrete implementation of the User class.
* **Benefits:**
  * **Loose Coupling:** The implementation of user loading can be completely swapped out (e.g., from a SQL database to an LDAP service) without changing a single line of code in the authentication filter.