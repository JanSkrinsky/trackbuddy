
---

## README.md – FRONTEND 

```md
# TrackBuddy Client
*Frontend for sport activity tracking*

---

## Overview

TrackBuddy Client is a single-page application built with **React**.  
It provides a clean user interface for managing sport activities and sport locations.

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

```text
client/
├── public/               # Static assets
├── src/
│   ├── App.jsx           # Main application component
│   ├── Header.jsx        # Application header
│   ├── ActivityList.jsx  # Activity list view
│   ├── Activity.jsx      # Single activity item
│   ├── ActivityModal.jsx # Modal form
│   ├── ActivityListProvider.jsx # Activities context
│   ├── LocationListProvider.jsx # Locations context
│   └── main.jsx          # Application entry point
├── index.html
├── vite.config.js
└── package.json
