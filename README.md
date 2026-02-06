# TrackBuddy

TrackBuddy je semestrální projekt zaměřený na návrh a implementaci webové aplikace pro evidenci sportovních aktivit.
Aplikace umožňuje správu míst, kde jsou aktivity vykonávány, a jednotlivých sportovních aktivit, které jsou s těmito místy propojeny.

Projekt je rozdělen na backendovou a frontendovou část, které jsou vyvíjeny v jednom veřejném GitHub repozitáři.

--------------------------------------------------

POPIS APLIKACE

Aplikace pracuje se dvěma datovými entitami:

- Location – reprezentuje místo, kde jsou vykonávány sportovní aktivity
- Activity – reprezentuje jednotlivé sportovní aktivity

Mezi entitami existuje vztah 1:N, kdy jedno místo může obsahovat více aktivit, zatímco každá aktivita je přiřazena právě k jednomu místu.

--------------------------------------------------

BACKEND

Backendová část aplikace poskytuje REST API pro správu datových entit Location a Activity.
API umožňuje provádět operace CRUD (Create, Read, Update, Delete) nad oběma entitami.

Použité technologie:
- Node.js
- Express.js
- SQLite

Spuštění backendu:
cd backend
npm install
npm run start

Backend běží na adrese:
http://localhost:3000

--------------------------------------------------

FRONTEND

Frontendová část aplikace slouží jako uživatelské rozhraní pro práci s backendovým API.

Použité technologie:
- React
- Vite
- JavaScript
- HTML
- CSS

Spuštění frontendu:
cd frontend
npm install
npm run dev

Frontend je dostupný na adrese:
http://localhost:5173

--------------------------------------------------

AUTOR

Jan Skrinsky

