import { Router } from "express";
import { student_metadata_db } from "../config/db.js";

const router = Router();

function formatTime(value) {
  if (!value) return "";
  // mysql2 TIME columns come back as 'HH:MM:SS'
  const [h, m] = String(value).split(":");
  const hour = parseInt(h, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${period}`;
}

function formatDate(value) {
  if (typeof value === "string") return value.slice(0, 10);
  const d = new Date(value);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

router.get("/dashboard", async (req, res) => {
  try {
    const today = formatDate(new Date());

    async function getPastEventDates(todayStr, limit = 2) {
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

    async function getUpcomingEventDates(todayStr, limit = 5) {
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

    const [pastDates, upcomingDates] = await Promise.all([
      getPastEventDates(today, 2),
      getUpcomingEventDates(today, 5),
    ]);
    // getPastEventDates comes back most-recent-first; flip to chronological
    pastDates.reverse();

    async function getEventsForDates(dates) {
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

    const allDates = [...pastDates, ...upcomingDates];
    const events = await getEventsForDates(allDates);

    const days = allDates.map((date) => ({
      date,
      events: events
        .filter((e) => formatDate(e.event_date) === date)
        .map((e) => ({
          id: e.id,
          title: e.title,
          time: e.is_all_day ? "All Day" : formatTime(e.event_time),
          color: e.color,
        })),
    }));

    return res.status(200).json({
      success: true,
      message: "Dashboard schedule fetched",
      data: { today, days },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch dashboard schedule" });
  }
});

// GET /events/all?month=3&year=2026
router.get("/events/all", async (req, res) => {
  try {
    const month = parseInt(req.query.month, 10);
    const year = parseInt(req.query.year, 10);

    if (
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12 ||
      !Number.isInteger(year) ||
      year < 1970
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid 'month' (1-12) and 'year' query params are required",
      });
    }

    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).getDate(); // day 0 of next month
    const endDate = `${year}-${String(month).padStart(2, "0")}-${String(
      lastDay,
    ).padStart(2, "0")}`;

    async function getEventsBetween(startDate, endDate) {
      const [rows] = await student_metadata_db.query(
        `SELECT id, title, description, event_date, event_time, is_all_day, color
       FROM events
      WHERE event_date BETWEEN ? AND ?
      ORDER BY event_date ASC, is_all_day DESC, event_time ASC`,
        [startDate, endDate],
      );
      return rows;
    }

    const events = await getEventsBetween(startDate, endDate);

    const eventsByDate = {};
    for (const e of events) {
      const key = formatDate(e.event_date);
      if (!eventsByDate[key]) eventsByDate[key] = [];
      eventsByDate[key].push({
        id: e.id,
        title: e.title,
        description: e.description,
        time: e.is_all_day ? "All Day" : formatTime(e.event_time),
        is_all_day: !!e.is_all_day,
        color: e.color,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Month events fetched",
      data: { month, year, daysInMonth: lastDay, eventsByDate },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch month events" });
  }
});

/**
 * POST /events/add
 * Body: { title, description?, event_date, event_time?, is_all_day?, color? }
 */
router.post("/events/add", async (req, res) => {
  try {
    const { title, description, event_date, event_time, is_all_day, color } =
      req.body;

    if (!title || !title.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "'title' is required" });
    }
    if (!event_date || !/^\d{4}-\d{2}-\d{2}$/.test(event_date)) {
      return res.status(400).json({
        success: false,
        message: "'event_date' is required in YYYY-MM-DD format",
      });
    }
    async function createEvent({
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
    const event = await createEvent({
      title: title.trim(),
      description,
      event_date,
      event_time,
      is_all_day: !!is_all_day,
      color,
      created_by: req.user?.id, // present if you wire up your auth middleware
    });

    return res
      .status(201)
      .json({ success: true, message: "Event created", data: event });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create event" });
  }
});

export default router;
