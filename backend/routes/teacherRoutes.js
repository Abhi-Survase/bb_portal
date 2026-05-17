import { Router } from "express";
const router = Router();
import { student_metadata_db } from "../config/db.js";
import logger from "../utils/logger.js";

router.get("/teacher-list", async (req, res) => {
  try {
    const fetchTeachersListQuery = `SELECT tch.id, tch.employee_code, tch.subject, tch.CREATED_AT FROM school_metadata.teachers tch WHERE tch.is_teaching = 1;`;
    const fetchTeachersListResult = await student_metadata_db.query(
      fetchTeachersListQuery,
    );
    logger.info(
      "teacher/teacher-list | Response | fetchTeachersListResult => " +
        JSON.stringify(fetchTeachersListResult[0]),
    );
    return res.json(fetchTeachersListResult[0]);
  } catch (error) {
    logger.error("teacher/teacher-list | Exception =>> " + error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
