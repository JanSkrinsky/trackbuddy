import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";

export default function LocationForm({ mode }) {
  const isEdit = mode === "edit";
  const { id } = useParams();
  const nav = useNavigate();

  const [form, setForm] = useState({ name: "", terrain: "road", difficulty: 1, note: "" });
  const [err, setErr] = useState("");
  const [fieldErr, setFieldErr] = useState({});
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      setLoading(true); setErr("");
      try {
        const l = await api.getLocation(id);
        setForm({ name: l.name ?? "", terrain: l.terrain ?? "road", difficulty: l.difficulty ?? 1, note: l.note ?? "" });
      } catch (e) { setErr(e.message); }
      finally { setLoading(false); }
    })();
  }, [id, isEdit]);

  function validate() {
    const fe = {};
    if (!form.name.trim()) fe.name = "Name is required.";
    if (!["road", "trail", "forest"].includes(form.terrain)) fe.terrain = "Invalid terrain.";
    const d = Number(form.difficulty);
    if (!Number.isInteger(d) || d < 1 || d > 5) fe.difficulty = "Difficulty must be 1–5.";
    setFieldErr(fe);
    return Object.keys(fe).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      terrain: form.terrain,
      difficulty: Number(form.difficulty),
      note: form.note.trim() ? form.note.trim() : null,
    };

    try {
      if (isEdit) await api.updateLocation(id, payload);
      else await api.createLocation(payload);
      nav("/locations");
    } catch (e2) {
      setErr(e2.message);
      if (e2.status === 409) setFieldErr(fe => ({ ...fe, name: e2.message }));
    }
  }

  if (loading) return <div className="card"><p className="muted">Loading…</p></div>;

  return (
    <div className="card">
      <div className="actions" style={{ justifyContent: "space-between" }}>
        <h1 style={{ margin: 0 }}>{isEdit ? "Edit Location" : "Add New Location"}</h1>
        <Link className="btn" to="/locations">Back</Link>
      </div>

      {err && <div className="notice">{err}</div>}

      <form onSubmit={onSubmit} style={{ marginTop: 12 }}>
        <div className="row">
          <div className="field">
            <label>Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            {fieldErr.name && <div className="error">{fieldErr.name}</div>}
          </div>

          <div className="field">
            <label>Terrain</label>
            <select value={form.terrain} onChange={e => setForm(f => ({ ...f, terrain: e.target.value }))}>
              <option value="road">Road</option>
              <option value="trail">Trail</option>
              <option value="forest">Forest</option>
            </select>
            {fieldErr.terrain && <div className="error">{fieldErr.terrain}</div>}
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Difficulty (1–5)</label>
            <input type="number" min="1" max="5" step="1"
              value={form.difficulty}
              onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
            />
            {fieldErr.difficulty && <div className="error">{fieldErr.difficulty}</div>}
          </div>

          <div className="field">
            <label>Note (optional)</label>
            <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
          </div>
        </div>

        <div className="actions">
          <button className="btn primary" type="submit">{isEdit ? "Save Changes" : "Save Location"}</button>
          <Link className="btn" to="/locations">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
