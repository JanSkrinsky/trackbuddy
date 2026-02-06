# TrackBuddy

TrackBuddy je semestrální projekt zaměřený na návrh a implementaci webové aplikace pro evidenci sportovních aktivit.  
Aplikace umožňuje správu míst, kde jsou aktivity vykonávány, a jednotlivých sportovních aktivit, které jsou s těmito místy propojeny.

Projekt je rozdělen na backendovou a frontendovou část, které jsou vyvíjeny v jednom veřejném GitHub repozitáři.

---

## Popis aplikace

Aplikace pracuje se dvěma datovými entitami:

- Location – reprezentuje místo, kde jsou vykonávány sportovní aktivity
- Activity – reprezentuje jednotlivé sportovní aktivity

Mezi entitami existuje vztah 1:N, kdy jedno místo může obsahovat více aktivit, zatímco každá aktivita je přiřazena právě k jednomu místu.

---

## Backend

Backendová část aplikace poskytuje REST API pro správu datových entit Location a Activity.  
API umožňuje provádět operace CRUD (Create, Read, Update, Delete) nad oběma entitami.

### Použité technologie
- Node.js
- Express.js
- SQLite

### Spuštění backendu

```bash
cd backend
npm install
npm run start
