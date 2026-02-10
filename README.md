TrackBuddy

TrackBuddy je semestrální projekt zaměřený na návrh a implementaci webové aplikace pro evidenci sportovních aktivit.
Aplikace umožňuje správu míst, kde jsou aktivity vykonávány, a jednotlivých sportovních aktivit, které jsou s těmito místy propojeny.

Projekt je realizován jako full-stack webová aplikace s oddělenou backendovou a frontendovou částí, vyvíjenou v jednom veřejném GitHub repozitáři.

Přehled aplikace

Aplikace pracuje se dvěma hlavními datovými entitami:

Location – reprezentuje místo, kde jsou vykonávány sportovní aktivity

Activity – reprezentuje jednotlivé sportovní aktivity

Mezi entitami existuje vztah 1 : N:

jedno Location může obsahovat více Activity

každá Activity je přiřazena právě k jednomu Location

Struktura projektu
trackBuddy/
├── backend/        # Backendová část (REST API)
├── frontend/       # Frontendová část (uživatelské rozhraní)
└── README.md       # Projektová dokumentace

Backend

Backendová část aplikace poskytuje REST API pro správu entit Location a Activity.
API podporuje kompletní CRUD operace (Create, Read, Update, Delete) pro obě entity.

Použité technologie

Node.js

Express.js

SQLite

Spuštění backendu
cd backend
npm install
npm run start


Backend běží na adrese:
👉 http://localhost:3000

Frontend

Frontendová část aplikace slouží jako uživatelské rozhraní pro komunikaci s backendovým API a správu sportovních aktivit a míst.

Použité technologie

React

Vite

JavaScript

HTML

CSS

Spuštění frontendu
cd frontend
npm install
npm run dev


Frontend je dostupný na adrese:
👉 http://localhost:5173

Funkcionalita

Správa míst (Location)

vytvoření, zobrazení, úprava a mazání

Správa aktivit (Activity)

vytvoření, zobrazení, úprava a mazání

Vazba aktivit na konkrétní místo

Komunikace mezi frontendem a backendem pomocí REST API

Autor

Jan Skrinsky