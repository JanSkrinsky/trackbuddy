TrackBuddy Backend

Node.js / Express backend application for managing sport activities and locations.

Overview

This is a RESTful backend application built with Express and SQLite, providing API endpoints for:

Managing sport locations (running / cycling spots)

Managing sport activities (runs and cycling sessions)

Validating input data according to business rules

Computing derived values (average speed)

Persisting data in a local SQLite database

The backend is designed to be consumed by a frontend application (e.g. React SPA).

Technology Stack

Node.js – JavaScript runtime

Express 5.2.1 – Web framework

better-sqlite3 12.6.2 – SQLite database driver

SQLite – Embedded database

cors – Cross-Origin Resource Sharing

nodemon – Development auto-reload

Project Structure
backend/
├── db.js               # Database initialization & schema definition
├── server.js           # Express server and API routes
├── trackbuddy.sqlite   # SQLite database file
├── package.json        # Project configuration & scripts
└── package-lock.json

Database Schema
locations

Stores sport locations.

Field	Type	Description
id	INTEGER	Primary key
name	TEXT	Unique (case-insensitive) location name
terrain	TEXT	road / trail / forest
difficulty	INTEGER	Difficulty level (1–5)
note	TEXT	Optional note

Constraints

name is unique (case-insensitive)

terrain must be one of road, trail, forest

difficulty must be between 1 and 5

activities

Stores sport activities.

Field	Type	Description
id	INTEGER	Primary key
type	TEXT	run / cycling
date	TEXT	ISO date (YYYY-MM-DD)
distance	REAL	Distance (> 0)
duration	REAL	Duration in minutes (> 0)
avgSpeed	REAL	Computed average speed
locationId	INTEGER	Reference to location

Constraints

date cannot be in the future

distance and duration must be positive

locationId must reference an existing location

Activities prevent deletion of their location

API Endpoints
Base & Health

GET / – Basic server message

GET /api/health – Health check

Locations API
Get all locations
GET /api/locations

Get location by ID
GET /api/locations/:id

Create location
POST /api/locations


Body

{
  "name": "Stromovka",
  "terrain": "trail",
  "difficulty": 3,
  "note": "Flat and fast"
}

Update location
PUT /api/locations/:id

Delete location
DELETE /api/locations/:id


❌ Deletion is blocked if the location has any activities.

Get activities for location
GET /api/locations/:id/activities

Activities API
Get all activities (with optional filters)
GET /api/activities


Query parameters

locationId

type (run / cycling)

from (ISO date)

to (ISO date)

Get activity by ID
GET /api/activities/:id

Create activity
POST /api/activities


Body

{
  "type": "run",
  "date": "2025-12-20",
  "distance": 10,
  "duration": 52,
  "locationId": 1
}


➡️ avgSpeed is computed automatically on the server.

Update activity
PUT /api/activities/:id

Delete activity
DELETE /api/activities/:id

Validation & Error Handling

The API uses consistent error responses:

Validation error (400)
{
  "error": "VALIDATION_ERROR",
  "message": "Distance must be > 0",
  "field": "distance"
}

Not found (404)
{
  "error": "NOT_FOUND",
  "message": "Activity not found"
}

Conflict (409)
{
  "error": "CONFLICT",
  "message": "Location with this name already exists"
}

Business Rules

Dates must be valid ISO dates (YYYY-MM-DD)

Dates cannot be in the future

avgSpeed is calculated as:

distance / (duration / 60)


Locations with activities cannot be deleted

Location names are unique (case-insensitive)

Getting Started
Prerequisites

Node.js v18+

Installation
npm install

Running the Server

Production

npm start


Development (auto-reload)

npm run dev


The server runs on:

http://localhost:3000

Development Notes
Architecture

Express handles routing and middleware

SQLite is initialized automatically on startup

Schema is created if it does not exist

Business logic and validation are handled server-side

Persistence

Data is stored in trackbuddy.sqlite

No ORM is used – SQL queries are explicit and readable

Future Enhancements

Possible improvements:

Pagination for activities

Authentication & user accounts

Soft deletes

Activity statistics (weekly / monthly)

Export to CSV / JSON

Deployment configuration (Docker)