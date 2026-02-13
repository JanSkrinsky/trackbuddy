import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api.js";

export default function LocationDetail() {
  const { id } = useParams();
  const [loc, setLoc] = useState(null);
  const [acts, setActs] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true); setErr("");
      try {
        setLoc(await api.getLocation(id));
        setActs(await api.getLocationActivities(id));
      } catch (e) { setErr(e.message); }
      finally { setLoading(false); }
    })();
  }, [id]);

  return (
    <div className="card">
      <div className="actions" style={{ justifyContent: "space-between" }}>
        <h1 style={{ margin: 0 }}>Location Detail</h1>
        <div className="actions">
          <Link className="btn" to="/locations">Back</Link>
          <Link className="btn primary" to={`/locations/${id}/edit`}>Edit</Link>
          <Link className="btn" to="/activities/new">Add Activity</Link>
        </div>
      </div>

      {loading ? <p className="muted">Loading…</p> :
        err ? <div className="notice">{err}</div> :
        <>
          <p><b>Name:</b> {loc.name}</p>
          <p><b>Terrain:</b> {loc.terrain}</p>
          <p><b>Difficulty:</b> {loc.difficulty}</p>
          <p><b>Note:</b> {loc.note || <span className="muted">—</span>}</p>

          <h2>Activities at this location</h2>
          {acts.length === 0 ? (
            <div className="notice">No activities for this location yet.</div>
          ) : (
            <table className="table">
              <thead><tr><th>Date</th><th>Type</th><th>Distance</th><th>Duration</th><th>AvgSpeed</th><th /></tr></thead>
              <tbody>
                {acts.map(a => (
                  <tr key={a.id}>
                    <td>{a.date}</td>
                    <td>{a.type}</td>
                    <td>{a.distance} km</td>
                    <td>{a.duration} min</td>
                    <td>{a.avgSpeed} km/h</td>
                    <td className="actions">
                      <Link className="btn" to={`/activities/${a.id}`}>Detail</Link>
                      <Link className="btn" to={`/activities/${a.id}/edit`}>Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      }
    </div>
  );
}
