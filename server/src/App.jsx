import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

import ActivitiesList from "./pages/ActivitiesList.jsx";
import ActivityForm from "./pages/ActivityForm.jsx";
import ActivityDetail from "./pages/ActivityDetail.jsx";

import LocationsList from "./pages/LocationsList.jsx";
import LocationForm from "./pages/LocationForm.jsx";
import LocationDetail from "./pages/LocationDetail.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/activities" replace />} />

          <Route path="/activities" element={<ActivitiesList />} />
          <Route path="/activities/new" element={<ActivityForm mode="create" />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route path="/activities/:id/edit" element={<ActivityForm mode="edit" />} />

          <Route path="/locations" element={<LocationsList />} />
          <Route path="/locations/new" element={<LocationForm mode="create" />} />
          <Route path="/locations/:id" element={<LocationDetail />} />
          <Route path="/locations/:id/edit" element={<LocationForm mode="edit" />} />

          <Route path="*" element={<div className="card">Not found</div>} />
        </Routes>
      </main>
    </>
  );
}
