import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmButton from "../components/ConfirmButton.jsx";
import { api } from "../api.js";

/* ===================== HELPERS ===================== */

function buildQuery({ type, locationId, from, to }) {
  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (locationId) params.set("locationId", locationId);
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const s = params.toString();
  return s ? `?${s}` : "";
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

/* ---- Pace (min/km) ---- (show only for run) */
function formatPace(durationMin, distanceKm, type) {
  if (type !== "run") return "–";
  if (!durationMin || !distanceKm) return "–";
  const pace = durationMin / distanceKm;
  const min = Math.floor(pace);
  const sec = Math.round((pace - min) * 60);
  return `${min}:${sec.toString().padStart(2, "0")} min/km`;
}

function formatTotalTime(totalMinutes) {
  const m = Math.max(0, Math.round(Number(totalMinutes || 0)));
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  return `${hh}:${String(mm).padStart(2, "0")} h`;
}

function formatAvgPace(totalMinutes, totalKm) {
  if (!totalKm || totalKm <= 0) return "–";
  const pace = totalMinutes / totalKm;
  const min = Math.floor(pace);
  const sec = Math.round((pace - min) * 60);
  return `${min}:${String(sec).padStart(2, "0")} min/km`;
}

/* ---------- CSV helpers (Excel-friendly) ---------- */

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[;"\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function downloadCsv(filename, rows) {
  const delimiter = ";";
  const body = rows.map((r) => r.map(csvEscape).join(delimiter)).join("\r\n");
  const bom = "\uFEFF"; // UTF-8 BOM for Excel
  const blob = new Blob([bom + body], { type: "text/csv;charset=utf-8" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ===================== COMPONENT ===================== */

export default function ActivitiesList() {
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);

  const [filters, setFilters] = useState({
    type: "",
    locationId: "",
    from: "",
    to: "",
  });

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const query = useMemo(() => buildQuery(filters), [filters]);

  // prevents stale requests overwriting newer results
  const reqSeq = useRef(0);

  async function load(q = query) {
    const mySeq = ++reqSeq.current;
    setLoading(true);
    setErr("");
    try {
      const data = await api.getActivities(q);
      if (mySeq !== reqSeq.current) return;
      setItems(data);
    } catch (e) {
      if (mySeq !== reqSeq.current) return;
      setErr(e.message);
    } finally {
      if (mySeq !== reqSeq.current) return;
      setLoading(false);
    }
  }

  // load locations once
  useEffect(() => {
    (async () => {
      try {
        const locs = await api.getLocations();
        setLocations(locs);
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, []);

  // reload activities when filters change
  useEffect(() => {
    load(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  async function onDelete(id) {
    setErr("");
    try {
      await api.deleteActivity(id);
      await load(query);
    } catch (e) {
      setErr(e.message);
    }
  }

  function resetFilters() {
    setFilters({ type: "", locationId: "", from: "", to: "" });
  }

  /* ===================== SUMMARY ===================== */

  const summary = useMemo(() => {
    const count = items.length;

    const totalDistance = items.reduce((s, a) => s + Number(a.distance || 0), 0);
    const totalDuration = items.reduce((s, a) => s + Number(a.duration || 0), 0);

    const avgSpeed = totalDuration > 0 ? totalDistance / (totalDuration / 60) : 0;
    const bestSpeed = items.reduce((m, a) => Math.max(m, Number(a.avgSpeed || 0)), 0);

    // for average pace: only RUN activities
    const runDistance = items
      .filter((a) => a.type === "run")
      .reduce((s, a) => s + Number(a.distance || 0), 0);
    const runDuration = items
      .filter((a) => a.type === "run")
      .reduce((s, a) => s + Number(a.duration || 0), 0);

    return {
      count,
      totalDistance: round2(totalDistance),
      totalDuration: Math.round(totalDuration),
      avgSpeed: round2(avgSpeed),
      bestSpeed: round2(bestSpeed),
      totalTime: formatTotalTime(totalDuration),
      avgPaceRunOnly: runDistance > 0 ? formatAvgPace(runDuration, runDistance) : "–",
      hasRuns: runDistance > 0,
    };
  }, [items]);

  /* ===================== CSV EXPORT ===================== */

  function onExportCsv() {
    const header = [
      "ID",
      "Datum",
      "Typ",
      "Vzdalenost_km",
      "Trvani_min",
      "Tempo_min_na_km",
      "Prumerna_rychlost_kmh",
      "Lokace",
    ];

    const rows = [
      header,
      ...items.map((a) => [
        a.id,
        a.date,
        a.type,
        a.distance,
        a.duration,
        a.type === "run" ? formatPace(a.duration, a.distance, a.type) : "", // blank for cycling
        a.avgSpeed,
        a.locationName ?? "",
      ]),
    ];

    const stamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-");

    downloadCsv(`trackbuddy-activities-${stamp}.csv`, rows);
  }

  /* ===================== RENDER ===================== */

  return (
    <div className="card">
      <div className="actions" style={{ justifyContent: "space-between" }}>
        <h1 style={{ margin: 0 }}>Activities</h1>
        <div className="actions">
          <button
            className="btn"
            type="button"
            onClick={onExportCsv}
            disabled={items.length === 0}
          >
            Export CSV
          </button>
          <Link className="btn primary" to="/activities/new">
            Add Activity
          </Link>
        </div>
      </div>

      {/* FILTERS */}
      <div className="card" style={{ marginTop: 12 }}>
        <div className="row">
          <div className="field">
            <label>Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
            >
              <option value="">All</option>
              <option value="run">Run</option>
              <option value="cycling">Cycling</option>
            </select>
          </div>

          <div className="field">
            <label>Location</label>
            <select
              value={filters.locationId}
              onChange={(e) =>
                setFilters((f) => ({ ...f, locationId: e.target.value }))
              }
            >
              <option value="">All</option>
              {locations.map((l) => (
                <option key={l.id} value={String(l.id)}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Date from</label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
            />
          </div>

          <div className="field">
            <label>Date to</label>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
            />
          </div>
        </div>

        <div className="actions">
          <button className="btn" type="button" onClick={resetFilters}>
            Reset filters
          </button>
          <span className="muted" style={{ fontSize: 12 }}>
            Filters are applied automatically.
          </span>
        </div>
      </div>

      {/* SUMMARY (3x3 grid -> 3 columns, 2 rows) */}
      {!loading && (
        <div className="card" style={{ marginTop: 12 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 16,
              alignItems: "start",
            }}
          >
            <div>
              <div className="muted">Activities</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{summary.count}</div>
            </div>

            <div>
              <div className="muted">Total distance</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>
                {summary.totalDistance} km
              </div>
            </div>

            <div>
              <div className="muted">Total time</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{summary.totalTime}</div>
            </div>

            <div>
              <div className="muted">Average speed</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>
                {summary.avgSpeed} km/h
              </div>
            </div>

            <div>
              <div className="muted">Average pace (run)</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>
                {summary.avgPaceRunOnly}
              </div>
            </div>

            <div>
              <div className="muted">Best speed</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>
                {summary.bestSpeed} km/h
              </div>
            </div>
          </div>

          <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>
            Average pace is calculated only from <b>run</b> activities (total run time /
            total run distance).
          </div>
        </div>
      )}

      {err && <div className="notice">{err}</div>}

      {loading ? (
        <p className="muted">Loading…</p>
      ) : items.length === 0 ? (
        <div className="notice">No activities match filters.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Distance</th>
              <th>Duration</th>
              <th>Pace</th>
              <th>AvgSpeed</th>
              <th>Location</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id}>
                <td>{a.date}</td>
                <td>{a.type}</td>
                <td>{a.distance} km</td>
                <td>{a.duration} min</td>
                <td>{formatPace(a.duration, a.distance, a.type)}</td>
                <td>{a.avgSpeed} km/h</td>
                <td>{a.locationName ?? a.locationId}</td>
                <td>
                  <div className="actions">
                    <Link className="btn" to={`/activities/${a.id}`}>
                      Detail
                    </Link>
                    <Link className="btn" to={`/activities/${a.id}/edit`}>
                      Edit
                    </Link>
                    <ConfirmButton
                      className="danger"
                      confirmText="Delete this activity?"
                      onConfirm={() => onDelete(a.id)}
                    >
                      Delete
                    </ConfirmButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
