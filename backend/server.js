const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// ---------- helpers ----------
function badRequest(res, message, field) {
  return res.status(400).json({ error: "VALIDATION_ERROR", message, field: field || null });
}
function notFound(res, message) {
  return res.status(404).json({ error: "NOT_FOUND", message: message || "Not found" });
}
function conflict(res, message) {
  return res.status(409).json({ error: "CONFLICT", message });
}
function todayIso() {
  return new Date().toISOString().slice(0, 10);
}
function isValidIsoDate(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return false;
  const [y, m, day] = s.split("-").map(Number);
  return d.getUTCFullYear() === y && d.getUTCMonth() + 1 === m && d.getUTCDate() === day;
}
function computeAvgSpeed(distance, durationMinutes) {
  const speed = distance / (durationMinutes / 60);
  return Math.round(speed * 100) / 100;
}

// ---------- base ----------
app.get("/", (req, res) => {
  res.send("TrackBuddy backend is running. Use /api/health");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// =====================================================
// LOCATIONS CRUD
// =====================================================

// GET all locations
app.get("/api/locations", (req, res) => {
  const rows = db.prepare("SELECT id, name, terrain, difficulty, note FROM locations ORDER BY id DESC").all();
  res.json(rows);
});

// GET location by id
app.get("/api/locations/:id", (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare("SELECT id, name, terrain, difficulty, note FROM locations WHERE id = ?").get(id);
  if (!row) return notFound(res, "Location not found");
  res.json(row);
});

// POST create location
app.post("/api/locations", (req, res) => {
  const { name, terrain, difficulty, note } = req.body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return badRequest(res, "Name is required", "name");
  }
  if (!["road", "trail", "forest"].includes(terrain)) {
    return badRequest(res, "Terrain must be one of: road, trail, forest", "terrain");
  }
  const diff = Number(difficulty);
  if (!Number.isInteger(diff) || diff < 1 || diff > 5) {
    return badRequest(res, "Difficulty must be an integer 1–5", "difficulty");
  }

  try {
    const info = db.prepare(`
      INSERT INTO locations (name, terrain, difficulty, note)
      VALUES (?, ?, ?, ?)
    `).run(name.trim(), terrain, diff, note ?? null);

    const created = db
      .prepare("SELECT id, name, terrain, difficulty, note FROM locations WHERE id = ?")
      .get(info.lastInsertRowid);

    res.status(201).json(created);
  } catch (e) {
    if (String(e.message).includes("UNIQUE")) return conflict(res, "Location with this name already exists");
    res.status(500).json({ error: "SERVER_ERROR", message: e.message });
  }
});

// PUT update location
app.put("/api/locations/:id", (req, res) => {
  const id = Number(req.params.id);
  const exists = db.prepare("SELECT id FROM locations WHERE id = ?").get(id);
  if (!exists) return notFound(res, "Location not found");

  const { name, terrain, difficulty, note } = req.body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return badRequest(res, "Name is required", "name");
  }
  if (!["road", "trail", "forest"].includes(terrain)) {
    return badRequest(res, "Terrain must be one of: road, trail, forest", "terrain");
  }
  const diff = Number(difficulty);
  if (!Number.isInteger(diff) || diff < 1 || diff > 5) {
    return badRequest(res, "Difficulty must be an integer 1–5", "difficulty");
  }

  try {
    db.prepare(`
      UPDATE locations
      SET name = ?, terrain = ?, difficulty = ?, note = ?
      WHERE id = ?
    `).run(name.trim(), terrain, diff, note ?? null, id);

    const updated = db
      .prepare("SELECT id, name, terrain, difficulty, note FROM locations WHERE id = ?")
      .get(id);

    res.json(updated);
  } catch (e) {
    if (String(e.message).includes("UNIQUE")) return conflict(res, "Location with this name already exists");
    res.status(500).json({ error: "SERVER_ERROR", message: e.message });
  }
});

// DELETE location (blocked if it has activities)
app.delete("/api/locations/:id", (req, res) => {
  const id = Number(req.params.id);
  const exists = db.prepare("SELECT id FROM locations WHERE id = ?").get(id);
  if (!exists) return notFound(res, "Location not found");

  const cnt = db.prepare("SELECT COUNT(*) AS cnt FROM activities WHERE locationId = ?").get(id).cnt;
  if (cnt > 0) return conflict(res, "Cannot delete location because it has activities");

  db.prepare("DELETE FROM locations WHERE id = ?").run(id);
  res.status(204).send();
});

// GET activities for location (UC4 helper)
app.get("/api/locations/:id/activities", (req, res) => {
  const id = Number(req.params.id);
  const loc = db.prepare("SELECT id FROM locations WHERE id = ?").get(id);
  if (!loc) return notFound(res, "Location not found");

  const rows = db.prepare(`
    SELECT id, type, date, distance, duration, avgSpeed, locationId
    FROM activities
    WHERE locationId = ?
    ORDER BY date DESC, id DESC
  `).all(id);

  res.json(rows);
});

// =====================================================
// ACTIVITIES CRUD
// =====================================================

// GET all activities (+ optional filters)
app.get("/api/activities", (req, res) => {
  const { locationId, type, from, to } = req.query;
  const where = [];
  const params = [];

  if (locationId !== undefined) { where.push("a.locationId = ?"); params.push(Number(locationId)); }
  if (type !== undefined) { where.push("a.type = ?"); params.push(String(type)); }
  if (from !== undefined) { where.push("a.date >= ?"); params.push(String(from)); }
  if (to !== undefined) { where.push("a.date <= ?"); params.push(String(to)); }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const rows = db.prepare(`
    SELECT a.id, a.type, a.date, a.distance, a.duration, a.avgSpeed, a.locationId,
           l.name AS locationName
    FROM activities a
    JOIN locations l ON l.id = a.locationId
    ${whereSql}
    ORDER BY a.date DESC, a.id DESC
  `).all(...params);

  res.json(rows);
});

// GET activity by id
app.get("/api/activities/:id", (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare(`
    SELECT a.id, a.type, a.date, a.distance, a.duration, a.avgSpeed, a.locationId,
           l.name AS locationName
    FROM activities a
    JOIN locations l ON l.id = a.locationId
    WHERE a.id = ?
  `).get(id);

  if (!row) return notFound(res, "Activity not found");
  res.json(row);
});

// POST create activity
app.post("/api/activities", (req, res) => {
  const { type, date, distance, duration, locationId } = req.body;

  if (!["run", "cycling"].includes(type)) return badRequest(res, "Type must be run or cycling", "type");
  if (!date || typeof date !== "string" || !isValidIsoDate(date)) {
    return badRequest(res, "Date must be a valid ISO date YYYY-MM-DD", "date");
  }
  if (date > todayIso()) return badRequest(res, "Date cannot be in the future", "date");

  const dist = Number(distance);
  if (!Number.isFinite(dist) || dist <= 0) return badRequest(res, "Distance must be > 0", "distance");

  const dur = Number(duration);
  if (!Number.isFinite(dur) || dur <= 0) return badRequest(res, "Duration must be > 0", "duration");

  const locId = Number(locationId);
  if (!Number.isInteger(locId)) return badRequest(res, "LocationId must be an integer", "locationId");

  const loc = db.prepare("SELECT id FROM locations WHERE id = ?").get(locId);
  if (!loc) return notFound(res, "Selected location does not exist");

  const avgSpeed = computeAvgSpeed(dist, dur);

  const info = db.prepare(`
    INSERT INTO activities (type, date, distance, duration, avgSpeed, locationId)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(type, date, dist, dur, avgSpeed, locId);

  const created = db.prepare(`
    SELECT a.id, a.type, a.date, a.distance, a.duration, a.avgSpeed, a.locationId,
           l.name AS locationName
    FROM activities a
    JOIN locations l ON l.id = a.locationId
    WHERE a.id = ?
  `).get(info.lastInsertRowid);

  res.status(201).json(created);
});

// PUT update activity
app.put("/api/activities/:id", (req, res) => {
  const id = Number(req.params.id);
  const exists = db.prepare("SELECT id FROM activities WHERE id = ?").get(id);
  if (!exists) return notFound(res, "Activity not found");

  const { type, date, distance, duration, locationId } = req.body;

  if (!["run", "cycling"].includes(type)) return badRequest(res, "Type must be run or cycling", "type");
  if (!date || typeof date !== "string" || !isValidIsoDate(date)) {
    return badRequest(res, "Date must be a valid ISO date YYYY-MM-DD", "date");
  }
  if (date > todayIso()) return badRequest(res, "Date cannot be in the future", "date");

  const dist = Number(distance);
  if (!Number.isFinite(dist) || dist <= 0) return badRequest(res, "Distance must be > 0", "distance");

  const dur = Number(duration);
  if (!Number.isFinite(dur) || dur <= 0) return badRequest(res, "Duration must be > 0", "duration");

  const locId = Number(locationId);
  if (!Number.isInteger(locId)) return badRequest(res, "LocationId must be an integer", "locationId");

  const loc = db.prepare("SELECT id FROM locations WHERE id = ?").get(locId);
  if (!loc) return notFound(res, "Selected location does not exist");

  const avgSpeed = computeAvgSpeed(dist, dur);

  db.prepare(`
    UPDATE activities
    SET type = ?, date = ?, distance = ?, duration = ?, avgSpeed = ?, locationId = ?
    WHERE id = ?
  `).run(type, date, dist, dur, avgSpeed, locId, id);

  const updated = db.prepare(`
    SELECT a.id, a.type, a.date, a.distance, a.duration, a.avgSpeed, a.locationId,
           l.name AS locationName
    FROM activities a
    JOIN locations l ON l.id = a.locationId
    WHERE a.id = ?
  `).get(id);

  res.json(updated);
});

// DELETE activity
app.delete("/api/activities/:id", (req, res) => {
  const id = Number(req.params.id);
  const exists = db.prepare("SELECT id FROM activities WHERE id = ?").get(id);
  if (!exists) return notFound(res, "Activity not found");

  db.prepare("DELETE FROM activities WHERE id = ?").run(id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
