const Database = require("better-sqlite3");

const db = new Database("trackbuddy.sqlite");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS locations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  terrain TEXT NOT NULL CHECK (terrain IN ('road', 'trail', 'forest')),
  difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  note TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_locations_name_ci
ON locations (LOWER(name));

CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL CHECK (type IN ('run', 'cycling')),
  date TEXT NOT NULL,
  distance REAL NOT NULL CHECK (distance > 0),
  duration REAL NOT NULL CHECK (duration > 0),
  avgSpeed REAL NOT NULL CHECK (avgSpeed > 0),
  locationId INTEGER NOT NULL,
  FOREIGN KEY (locationId) REFERENCES locations(id) ON DELETE RESTRICT
);
`);

module.exports = db;
