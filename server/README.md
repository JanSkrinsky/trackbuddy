# TrackBuddy Client
*Frontend for sport activity tracking*

---

## Overview

TrackBuddy Client is a single-page application built with **React**.  
It provides a user interface for managing sport activities and sport locations.

The application communicates with a REST API backend and focuses on simplicity and clarity.

### Main features
- Viewing sport activities
- Creating new activities (run, cycling)
- Editing existing activities
- Viewing and selecting sport locations
- Filtering activities by location, type and date range

---

## Technology Stack

- **React** – UI library
- **Vite** – Development server and build tool
- **Bootstrap 5** – CSS framework
- **React Bootstrap** – UI components
- **Fetch API** – Backend communication

---

## Project Structure

    client/
    ├── public/               # Static assets
    ├── src/
    │   ├── App.jsx           # Main application component
    │   ├── Header.jsx        # Application header
    │   ├── ActivityList.jsx  # Activity list view
    │   ├── Activity.jsx      # Single activity item
    │   ├── ActivityModal.jsx # Modal form for create / edit
    │   ├── ActivityListProvider.jsx # Activities context
    │   ├── LocationListProvider.jsx # Locations context
    │   └── main.jsx          # Application entry point
    ├── index.html
    ├── vite.config.js
    └── package.json

---

## Application Structure

### App.jsx
Root component that initializes the application and sets up context providers:
- ActivityListProvider
- LocationListProvider

---

### Header.jsx
Displays:
- Application title
- Refresh button
- Button for creating a new activity

---

### ActivityList.jsx
Responsible for:
- Displaying the list of activities
- Handling loading and error states
- Managing modal state
- Filtering activities

---

### Activity.jsx
Displays a single activity:
- Activity type (run / cycling)
- Date
- Distance
- Duration
- Average speed
- Location name
- Edit button

---

### ActivityModal.jsx
Modal form used for creating and editing activities.

Form fields:
- type
- date
- distance
- duration
- locationId

---

## API Integration

The frontend communicates with the backend using the following endpoints:

### Activities

    GET /api/activities
    GET /api/activities/:id
    POST /api/activities
    PUT /api/activities/:id
    DELETE /api/activities/:id

### Locations

    GET /api/locations
    GET /api/locations/:id
    POST /api/locations
    PUT /api/locations/:id
    DELETE /api/locations/:id

---

## Getting Started

### Prerequisites
- Node.js **v18+**
- npm

### Installation

    npm install

### Run Application

    npm run dev

Application runs at:

    http://localhost:5173

Backend must be running at:

    http://localhost:3000

---

## Features

### Activity Management
- View activities
- Create new activities
- Edit existing activities
- Filter activities
- Client-side validation
- Error handling

### User Interface
- Responsive layout
- Modal dialogs
- Clear and simple UI

---

## Future Enhancements

- Location management UI
- Activity statistics and charts
- Authentication
- Export to CSV
