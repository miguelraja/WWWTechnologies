import sqlite3 from "sqlite3";
import path from "path";

const __dirname = import.meta.dirname;
const default_db_filename = path.join(__dirname, "db", "data.db");

let db;

const schema_sql = `
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    owner_user_id INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE SET NULL
  );
`;


// initialize db and create tables
export const db_initialize_create = async (filename = default_db_filename) => {
  if (db) {
    await close_db();
  }

  return new Promise((resolve, reject) => {
    const created_db = new sqlite3.Database(filename, (open_err) => {
      if (open_err) {
        return reject(new Error(`Database open error: ${open_err.message}`));
      }

      created_db.exec(schema_sql, (schema_err) => {
        if (schema_err) {
          return reject(new Error(`Database schema initialization error: ${schema_err.message}`));
        }

        db = created_db;
        resolve(db);
      });
    });
  });
};

export const close_db = async () => {
  if (!db) return;

  const current_db = db;
  db = null;

  return new Promise((resolve, reject) => {
    current_db.close((err) => {
      if (err) {
        return reject(new Error(`Database close error: ${err.message}`));
      }
      resolve();
    });
  });
};

export const get_db = () => {
  if (!db) throw new Error("DB not initialized. Call db_initialize_create() first.");
  return db;
};