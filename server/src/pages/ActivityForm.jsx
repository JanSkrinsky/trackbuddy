import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function computeAvgSpeed(distance, duration) {
  const dist = Number(distance);
  const dur = Number(duration);
  if (!Number.isFinite(dist) || !Number.isFinite(dur) || dist <= 0 || dur <= 0) return "";
  const speed = dist / (dur / 60);
  return Math.round(speed * 100) / 100;
}

export default function ActivityForm({ mode }) {
  const isEdit = mode === "edit";
  const { id } = useParams();
  const nav = useNavigate();

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    type: "run",
    date: todayIso(),
    distance: "",
    duration: "",
    locationId: "",
  });

  const [err, setErr] = useState("");
  const [fieldErr, setFieldErr] = useState({});

  const avgSpeed = useMemo(
    () => computeAvgSpeed(form.distance, form.duration),
    [form.distance, form.duration]
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const locs = await api.getLocations();
        setLocations(locs);

        if (locs.length > 0 && !form.locationId) {
          setForm((f) => ({ ...f, locationId: String(locs[0].id) }));
        }

        if (isEdit) {
          const a = await api.getActivity(id);
          setForm({
            type: a.type,
            date: a.date,
            distance: String(a.distance),
            duration: String(a.duration),
            locationId: String(a.locationId),
          });
        }
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  function validate() {
    const fe = {};
    if (!["run", "cycling"].includes(form.type)) fe.type = "Select run or cycling.";
    if (!form.date) fe.date = "Date is required.";
    else if (form.date > todayIso()) fe.date = "Date cannot be in the future.";

    const dist = Number(form.distance);
    if (!Number.isFinite(dist) || dist <= 0) fe.distance = "Distance must be > 0.";

    const dur = Number(form.duration);
    if (!Number.isFinite(dur) || dur <= 0) fe.duration = "Duration must be > 0.";

    const locId = Number(form.locationId);
    if (!Number.isInteger(locId)) fe.locationId = "Location is required.";

    setFieldErr(fe);
    return Object.keys(fe).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!validate()) return;

    const payload = {
      type: form.type,
      date: form.date,
      distance: Number(form.distance),
      duration: Number(form.duration),
      locationId: Number(form.locationId),
    };

    try {
      if (isEdit) await api.updateActivity(id, payload);
      else await api.createActivity(payload);
      nav("/activities");
    } catch (e2) {
      setErr(e2.message);
      if (e2?.data?.field) {
        setFieldErr((fe) => ({ ...fe, [e2.data.field]: e2.message }));
      }
    }
  }

  if (loading) return <div className="card"><p className="muted">Loading…</p></div>;

  // když nejsou lokace, nelze založit aktivitu
  if (locations.length === 0) {
    return (
      <div className="card">
        <h1>{isEdit ? "Edit Activity" : "Add New Activity"}</h1>
        <div className="notice">
          No locations available. Create a location first.
        </div>
        <div className="actions" style={{ marginTop: 12 }}>
          <Link className="btn" to="/activities">Back</Link>
          <Link className="btn primary" to="/locations/new">Add Location</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="actions" style={{ justifyContent: "space-between" }}>
        <h1 style={{ margin: 0 }}>{isEdit ? "Edit Activity" : "Add New Activity"}</h1>
        <Link className="btn" to="/activities">Back</Link>
      </div>

      {err && <div className="notice">{err}</div>}

      <form onSubmit={onSubmit} style={{ marginTop: 12 }}>
        <div className="row">
          <div className="field">
            <label>Activity type</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            >
              <option value="run">Run</option>
              <option value="cycling">Cycling</option>
            </select>
            {fieldErr.type && <div className="error">{fieldErr.type}</div>}
          </div>

          <div className="field">
            <label>Date</label>
            <input
              type="date"
              value={form.date}
              max={todayIso()}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
            {fieldErr.date && <div className="error">{fieldErr.date}</div>}
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Distance (km)</label>
            <input
              type="number"
              step="0.01"
              value={form.distance}
              onChange={(e) => setForm((f) => ({ ...f, distance: e.target.value }))}
            />
            {fieldErr.distance && <div className="error">{fieldErr.distance}</div>}
          </div>

          <div className="field">
            <label>Duration (min)</label>
            <input
              type="number"
              step="0.1"
              value={form.duration}
              onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
            />
            {fieldErr.duration && <div className="error">{fieldErr.duration}</div>}
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Location</label>
            <select
              value={form.locationId}
              onChange={(e) => setForm((f) => ({ ...f, locationId: e.target.value }))}
            >
              {locations.map((l) => (
                <option key={l.id} value={String(l.id)}>
                  {l.name} ({l.terrain}, diff {l.difficulty})
                </option>
              ))}
            </select>
            {fieldErr.locationId && <div className="error">{fieldErr.locationId}</div>}
          </div>

          <div className="field">
            <label>AvgSpeed (km/h) – readonly</label>
            <input readOnly value={avgSpeed === "" ? "" : String(avgSpeed)} />
            <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
              Computed as distance / (duration/60)
            </div>
          </div>
        </div>

        <div className="actions" style={{ marginTop: 12 }}>
          <button className="btn primary" type="submit">
            {isEdit ? "Save Changes" : "Save Activity"}
          </button>
          <Link className="btn" to="/activities">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
