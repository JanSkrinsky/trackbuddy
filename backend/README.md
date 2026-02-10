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

```text
backend/
├── db.js               # Database initialization and schema definition
├── server.js           # Express server and API routes
├── trackbuddy.sqlite   # SQLite database
├── package.json
└── package-lock.json
