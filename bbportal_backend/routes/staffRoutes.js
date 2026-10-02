import { Router } from "express";
const router = Router();
import { student_metadata_db } from "../config/db.js";
import logger from "../utils/logger.js";

router.get("/staff-list", async (req, res) => {
  try {
    const fetchStaffListQuery = `SELECT usr.id, usr.access_level, ud.first_name, ud.last_name, ud.gender, usr.email_id, ud.contact_number, usr.CREATED_AT FROM school_metadata.users usr INNER JOIN school_metadata.user_details ud ON usr.id = ud.user_id WHERE usr.is_deleted = 0;`;
    const fetchStaffListResult =
      await student_metadata_db.query(fetchStaffListQuery);
    logger.info(
      "user/staff-list | Response | fetchStaffListResult => " +
        JSON.stringify(fetchStaffListResult[0]),
    );
    return res.json(fetchStaffListResult[0]);
  } catch (error) {
    logger.error("user/staff-list | Exception =>> " + error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
