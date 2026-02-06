import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api.js";

export default function ActivityDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const data = await api.getActivity(id);
        setItem(data);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="card">
      <div className="actions" style={{ justifyContent: "space-between" }}>
        <h1 style={{ margin: 0 }}>Activity Detail</h1>
        <div className="actions">
          <Link className="btn" to="/activities">
            Back
          </Link>
          <Link className="btn primary" to={`/activities/${id}/edit`}>
            Edit
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : err ? (
        <div className="notice">{err}</div>
      ) : (
        <div style={{ marginTop: 12 }}>
          <p>
            <b>Date:</b> {item.date}
          </p>
          <p>
            <b>Type:</b> {item.type}
          </p>
          <p>
            <b>Distance:</b> {item.distance} km
          </p>
          <p>
            <b>Duration:</b> {item.duration} min
          </p>
          <p>
            <b>AvgSpeed:</b> {item.avgSpeed} km/h
          </p>
          <p>
            <b>Location:</b> {item.locationName ?? item.locationId}
          </p>
        </div>
      )}
    </div>
  );
}
