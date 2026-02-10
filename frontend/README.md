TrackBuddy Client

React-based frontend application for managing sport activities and locations.

Overview

This is a single-page application built with React that provides a user interface for:

Viewing a list of sport activities

Creating new activities (run, cycling)

Updating existing activities

Viewing and selecting sport locations

Filtering activities by location, type and date range

Technology Stack

React – UI library

Vite – Development server and build tool

Bootstrap 5 – CSS framework

React Bootstrap – UI components

Fetch API – Backend communication

Project Structure
client/
├── public/              # Static assets
├── src/
│   ├── App.jsx         # Main application component
│   ├── Header.jsx      # Application header
│   ├── ActivityList.jsx        # Activity list view
│   ├── Activity.jsx            # Single activity item
│   ├── ActivityModal.jsx       # Modal form for create/update activity
│   ├── ActivityListProvider.jsx # Context provider for activities
│   ├── LocationListProvider.jsx # Context provider for locations
│   └── main.jsx        # Application entry point
├── index.html
├── vite.config.js
└── package.json

Components
App.jsx

Root component that sets up the provider hierarchy:

ActivityListProvider – Manages activity state and API calls

LocationListProvider – Manages location state and API calls

ActivityList – Main view component

Header.jsx

Displays the application header with:

Application title

Refresh button (reloads activity list)

Button for creating a new activity

ActivityList.jsx

Main container component that:

Fetches and displays the list of activities

Handles loading and error states

Manages modal state (create / edit)

Passes edit handlers to Activity components

Supports filtering by location, type and date

Activity.jsx

Displays a single activity record with:

Activity type (run / cycling)

Activity date

Distance

Duration

Average speed

Location name

Edit button

ActivityModal.jsx

Reusable modal form component used for:

Create mode – Creating a new activity

Edit mode – Updating an existing activity

Form Fields:

type (required) – Activity type (run, cycling)

date (required) – Activity date (must not be in the future)

distance (required, number > 0) – Distance

duration (required, number > 0) – Duration in minutes

locationId (required, select) – Location selection

Features:

Client-side validation

Error message display

Loading state during submit

Automatic activity list refresh after save

ActivityListProvider.jsx

React Context provider responsible for:

Activity data state

Loading and error states

Communication with backend API

Exposed methods:

fetchActivities() – GET /api/activities

createActivity(data) – POST /api/activities

updateActivity(id, data) – PUT /api/activities/:id

deleteActivity(id) – DELETE /api/activities/:id

Usage:

import { useActivityList } from './ActivityListProvider';

function MyComponent() {
  const { data, status, handlerMap } = useActivityList();

  if (status === 'loading') return null;

  handlerMap.createActivity({ ... });
}

LocationListProvider.jsx

React Context provider responsible for:

Location data state

Location lookup map

Backend API communication

Usage:

import { useLocationList } from './LocationListProvider';

function MyComponent() {
  const { data, locationMap } = useLocationList();

  const location = locationMap[locationId];
}

Getting Started
Prerequisites

Node.js (v18 or higher)

npm

Installation

Navigate to the client directory:

cd client


Install dependencies:

npm install

Running the Application

Start the development server:

npm run dev


The application will be available at:

http://localhost:5173


Note:
The frontend communicates with the backend running at http://localhost:3000.
Make sure the backend server is running before using the application.

Available Scripts

npm run dev – Runs the app in development mode

npm run build – Builds the app for production

npm run preview – Previews the production build

API Integration

The client communicates with the backend through the following endpoints:

Activity Endpoints

GET /api/activities – Fetch activities

POST /api/activities – Create activity

PUT /api/activities/:id – Update activity

DELETE /api/activities/:id – Delete activity

Location Endpoints

GET /api/locations – Fetch locations

POST /api/locations – Create location

PUT /api/locations/:id – Update location

DELETE /api/locations/:id – Delete location

Features
Activity Management

✅ View list of activities

✅ Create new activities

✅ Edit existing activities

✅ Input validation

✅ Automatic average speed calculation

✅ Filtering by location, type and date

✅ Error handling and loading states

User Interface

✅ Responsive Bootstrap layout

✅ Modal forms

✅ Clear activity overview

✅ Simple and intuitive UI

Development Notes
State Management

React Context API is used for global state

Activities and locations are handled in separate providers

Modal state is managed locally

Styling

Bootstrap 5 for layout and styling

Custom styling can be added as needed

Date Handling

Dates are handled in ISO format (YYYY-MM-DD)

Future dates are blocked on both client and server

Troubleshooting
Backend Connection Issues

Ensure backend runs on port 3000

Check CORS configuration if requests fail

Build Issues

Remove dependencies and reinstall:

rm -rf node_modules && npm install

Future Enhancements

Potential improvements:

Location management UI

Activity statistics and charts

Pagination for large datasets

Authentication and user accounts

Export activities to CSV