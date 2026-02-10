# TrackBuddy
*Full-stack application for sport activity tracking*

---

## Overview

TrackBuddy is a full-stack web application for tracking sport activities such as running and cycling.  
The project consists of a **backend REST API** and a **frontend single-page application**.

The backend is responsible for data persistence and business logic,  
while the frontend provides a user-friendly interface for managing activities and locations.

---

## Project Architecture

The project is divided into two main parts:

- **Backend** – REST API built with Node.js and Express
- **Frontend** – Single-page application built with React

---

## Repository Structure

    
    ├── backend/          # Node.js / Express REST API
    ├── frontend/         # React single-page application
    └── README.md         # Project documentation

---

## Backend

The backend provides a RESTful API for managing sport activities and locations.

### Responsibilities
- Managing sport locations
- Managing sport activities (running, cycling)
- Input validation
- Average speed calculation
- Data persistence in SQLite

### Technology Stack
- Node.js
- Express
- SQLite (better-sqlite3)
- cors

### Main API Endpoints

#### Health
    GET /api/health

#### Locations
    GET /api/locations
    GET /api/locations/:id
    POST /api/locations
    PUT /api/locations/:id
    DELETE /api/locations/:id
    GET /api/locations/:id/activities

#### Activities
    GET /api/activities
    GET /api/activities/:id
    POST /api/activities
    PUT /api/activities/:id
    DELETE /api/activities/:id

---

## Frontend

The frontend is a single-page application that communicates with the backend API.

### Features
- View list of sport activities
- Create new activities
- Edit existing activities
- Select sport locations
- Filter activities by type, location and date

### Technology Stack
- React
- Vite
- Bootstrap 
- React Bootstrap

---

## Frontend ↔ Backend Communication

The frontend communicates with the backend via REST API requests.

- Backend runs on:
  
      http://localhost:3000

- Frontend runs on:
  
      http://localhost:5173

---

## Getting Started

### Prerequisites
- Node.js **v18+**
- npm

---

### Installation

Install backend dependencies:

    cd backend
    npm install

Install frontend dependencies:

    cd frontend
    npm install

---

### Running the Application

Start backend server:

    cd backend
    npm start

or development mode:

    npm run dev

Start frontend application:

    cd frontend
    npm run dev

---

## Validation Rules (Backend)

- Dates must be in ISO format (YYYY-MM-DD)
- Future dates are not allowed
- Distance and duration must be greater than zero
- Locations must exist before assigning activities
- Location names are unique (case-insensitive)

---

## Future Enhancements

- User authentication
- Activity statistics and charts
- Pagination
- Export data to CSV
- Improved UI for location management

---

## Notes

Each part of the project contains its own `README.md` with more detailed documentation:
- `backend/README.md`
- `frontend/README.md`
