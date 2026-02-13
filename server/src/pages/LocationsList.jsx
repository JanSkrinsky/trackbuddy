import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmButton from "../components/ConfirmButton.jsx";
import { api } from "../api.js";

export default function LocationsList() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true); setErr("");
    try { setItems(await api.getLocations()); }
    catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function onDelete(id) {
    setErr("");
    try { await api.deleteLocation(id); await load(); }
    catch (e) { setErr(e.message); }
  }

  return (
    <div className="card">
      <div className="actions" style={{ justifyContent: "space-between" }}>
        <h1 style={{ margin: 0 }}>Locations</h1>
        <Link className="btn primary" to="/locations/new">Add Location</Link>
      </div>

      {err && <div className="notice">{err}</div>}
      {loading ? <p className="muted">Loading…</p> :
        items.length === 0 ? (
          <div className="notice">No locations yet. <Link to="/locations/new">Add one</Link>.</div>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Terrain</th><th>Difficulty</th><th>Note</th><th /></tr>
            </thead>
            <tbody>
              {items.map(l => (
                <tr key={l.id}>
                  <td>{l.name}</td>
                  <td>{l.terrain}</td>
                  <td>{l.difficulty}</td>
                  <td className="muted">{l.note || ""}</td>
                  <td>
                    <div className="actions">
                      <Link className="btn" to={`/locations/${l.id}`}>Detail</Link>
                      <Link className="btn" to={`/locations/${l.id}/edit`}>Edit</Link>
                      <ConfirmButton
                        className="danger"
                        confirmText="Delete this location? (If it has activities, it will be blocked.)"
                        onConfirm={() => onDelete(l.id)}
                      >
                        Delete
                      </ConfirmButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    </div>
  );
}
