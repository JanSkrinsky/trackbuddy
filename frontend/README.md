# TrackBuddy Frontend (React)

Frontendová část aplikace TrackBuddy pro evidenci sportovních aktivit a lokalit. Frontend komunikuje s backendem výhradně pomocí REST API.

---

## Requirements

* Node.js + npm
* TrackBuddy Backend spuštěný na adrese:
  [http://localhost:3000](http://localhost:3000)

---

## Install

npm install

---

## Run (dev)

npm run dev

Frontend je poté dostupný v prohlížeči (typicky na [http://localhost:5173](http://localhost:5173)).

---

## Pages

* `/activities` – seznam aktivit, mazání, detail, editace
* `/activities/new` – vytvoření nové aktivity
* `/locations` – seznam lokalit, mazání, detail, editace
* `/locations/new` – vytvoření nové lokality

---

## API

Frontend volá backendové endpointy pod adresou:

http://localhost:3000/api

Komunikace probíhá pomocí HTTP metod GET, POST, PUT a DELETE.

---

# TrackBuddy Backend (Node.js + Express)

Backendová část aplikace TrackBuddy, která zajišťuje aplikační logiku, práci s databází a poskytuje REST API pro frontend.

---

## Requirements

* Node.js + npm

---

## Install

npm install

---

## Run

npm start

Backend běží na adrese:

http://localhost:3000

---

## API Base URL

http://localhost:3000/api

---

## Main Endpoints

* `GET /api/health` – kontrola dostupnosti backendu

### Activities

* `GET /api/activities`
* `GET /api/activities/:id`
* `POST /api/activities`
* `PUT /api/activities/:id`
* `DELETE /api/activities/:id`

### Locations

* `GET /api/locations`
* `GET /api/locations/:id`
* `POST /api/locations`
* `PUT /api/locations/:id`
* `DELETE /api/locations/:id`

---

## Database

* SQLite
* databázový soubor: `trackbuddy.sqlite`
* data jsou perzistentní mezi spuštěními aplikace

---

## Architecture

* frontend a backend jsou oddělené části aplikace
* komunikace probíhá přes REST API
* backend je stateless a slouží jako datová vrstva



