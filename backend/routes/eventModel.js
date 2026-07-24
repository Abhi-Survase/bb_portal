// Adjust this import to match wherever your project exports its mysql2
// promise pool (same pool your students/teachers/users models already use).
// import pool from "../config/db.js";
import { student_metadata_db } from "../config/db.js";
/**
 * Fetch every distinct date (as 'YYYY-MM-DD') strictly before `todayStr`
 * that has at least one event, most recent first, limited to `limit` days.
 */
export async function getPastEventDates(todayStr, limit = 2) {
  const [rows] = await student_metadata_db.query(
    `SELECT DISTINCT event_date
       FROM events
      WHERE event_date < ?
      ORDER BY event_date DESC
      LIMIT ?`,
    [todayStr, limit],
  );
  return rows.map((r) => formatDate(r.event_date));
}

/**
 * Fetch every distinct date (as 'YYYY-MM-DD') on/after `todayStr`
 * that has at least one event, soonest first, limited to `limit` days.
 */
export async function getUpcomingEventDates(todayStr, limit = 5) {
  const [rows] = await student_metadata_db.query(
    `SELECT DISTINCT event_date
       FROM events
      WHERE event_date >= ?
      ORDER BY event_date ASC
      LIMIT ?`,
    [todayStr, limit],
  );
  return rows.map((r) => formatDate(r.event_date));
}

/**
 * Fetch all events that fall on any of the given dates.
 * `dates` is an array of 'YYYY-MM-DD' strings.
 */
export async function getEventsForDates(dates) {
  if (!dates.length) return [];
  const [rows] = await student_metadata_db.query(
    `SELECT id, title, description, event_date, event_time, is_all_day, color
       FROM events
      WHERE event_date IN (?)
      ORDER BY event_date ASC, is_all_day DESC, event_time ASC`,
    [dates],
  );
  return rows;
}

/**
 * Fetch all events between two dates (inclusive), used for the month view.
 */
export async function getEventsBetween(startDate, endDate) {
  const [rows] = await student_metadata_db.query(
    `SELECT id, title, description, event_date, event_time, is_all_day, color
       FROM events
      WHERE event_date BETWEEN ? AND ?
      ORDER BY event_date ASC, is_all_day DESC, event_time ASC`,
    [startDate, endDate],
  );
  return rows;
}

export async function createEvent({
  title,
  description,
  event_date,
  event_time,
  is_all_day,
  color,
  created_by,
}) {
  const [result] = await student_metadata_db.query(
    `INSERT INTO events (title, description, event_date, event_time, is_all_day, color, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      description || null,
      event_date,
      is_all_day ? null : event_time || null,
      is_all_day ? 1 : 0,
      color || "bg-blue-500",
      created_by || null,
    ],
  );
  const [rows] = await student_metadata_db.query(
    `SELECT * FROM events WHERE id = ?`,
    [result.insertId],
  );
  return rows[0];
}

// mysql2 returns DATE columns as JS Date objects (in local server time) -
// normalize to 'YYYY-MM-DD' so it's safe to use as an object key / compare
// against strings on the frontend.
function formatDate(value) {
  if (typeof value === "string") return value.slice(0, 10);
  const d = new Date(value);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export { formatDate };
