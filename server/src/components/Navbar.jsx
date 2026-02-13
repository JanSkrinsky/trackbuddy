import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  const style = ({ isActive }) => ({
    padding: "8px 10px",
    borderRadius: "10px",
    border: "1px solid transparent",
    background: isActive ? "#f3f3f3" : "transparent",
    textDecoration: "none",
  });

  return (
    <header className="nav">
      <div className="nav-inner">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src={logo}
            alt="TrackBuddy logo"
            style={{ height: 34, width: 34, objectFit: "contain" }}
          />
          <div className="brand">TrackBuddy</div>
        </div>

        <nav className="links">
          <NavLink to="/activities" style={style}>Activities</NavLink>
          <NavLink to="/activities/new" style={style}>Add Activity</NavLink>
          <NavLink to="/locations" style={style}>Locations</NavLink>
          <NavLink to="/locations/new" style={style}>Add Location</NavLink>
        </nav>
      </div>
    </header>
  );
}
