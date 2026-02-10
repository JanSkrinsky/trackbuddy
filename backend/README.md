# TrackBuddy Backend
*REST API for sport activity tracking*

---

## Overview

TrackBuddy Backend is a RESTful API built with **Node.js** and **Express**.  
It provides all server-side functionality required for managing sport activities and locations.

The backend is designed to be consumed by a frontend single-page application.

### Main responsibilities
- Managing sport locations
- Managing sport activities (running and cycling)
- Validating input data
- Computing average speed
- Persisting data in an SQLite database

---

## Technology Stack

- **Node.js** – JavaScript runtime
- **Express** – Web framework
- **better-sqlite3** – SQLite database driver
- **SQLite** – Embedded database
- **cors** – Cross-origin resource sharing
- **nodemon** – Development auto-reload

---

## Project Structure

    backend/
    ├── db.js               # Database initialization and schema definition
    ├── server.js           # Express server and API routes
    ├── trackbuddy.sqlite   # SQLite database
    ├── package.json
    └── package-lock.json

---

## API Endpoints

### Health

    GET /api/health
    Server health check

---

### Locations

    GET /api/locations
    Returns all locations
    GET /api/locations/:id
    Returns location by ID
    POST /api/locations
    Creates a new location
    PUT /api/locations/:id
    Updates an existing location
    DELETE /api/locations/:id
    Deletes a location
    (blocked if activities exist)
    GET /api/locations/:id/activities
    Returns all activities for a location

---

### Activities

    GET /api/activities
    Returns all activities
    GET /api/activities/:id
    Returns activity by ID
    POST /api/activities
    Creates a new activity
    PUT /api/activities/:id
    Updates an existing activity
    DELETE /api/activities/:id
    Deletes an activity

---

## Validation Rules

- Dates must be in ISO format (`YYYY-MM-DD`)
- Future dates are not allowed
- Distance and duration must be greater than zero
- Locations must exist before assigning activities
- Location names are unique (case-insensitive)

---

## Getting Started

### Prerequisites
- Node.js **v18+**

### Installation

    npm install

### Run Server

    npm start

or development mode:

    npm run dev

Server runs at:

    http://localhost:3000

---

## Future Enhancements

- Authentication and users
- Activity statistics
- Pagination
- Data export
