import { Router } from "express";
const router = Router();
import { student_metadata_db } from "../config/db.js";
import logger from "../utils/logger.js";

router.get("/teacher-list", async (req, res) => {
  try {
    const fetchTeachersListQuery = `SELECT tch.id, tch.employee_no, tch.subject, tch.first_name, tch.last_name, td.email_id, td.contact_number, tch.date_of_joining, tch.photo_url FROM school_metadata.teachers tch INNER JOIN school_metadata.teacher_details td ON tch.id = td.teacher_id WHERE tch.is_teaching = 1;`;
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

router.post("/add-teacher", async (req, res) => {
  const dbConnection = await student_metadata_db.getConnection();
  try {
    await dbConnection.beginTransaction();
    const values = {
      employee_no: req.body.employee_no,
      subject: req.body.subject,
      first_name: req.body.first_name,
      middle_name: req.body.middle_name,
      last_name: req.body.last_name,
      gender: req.body.gender,
      email_id: req.body.email_id,
      contact_number: req.body.contact_number,
      date_of_joining: req.body.date_of_joining,
    };
    logger.info("teacher/add-teacher | Request =>> " + JSON.stringify(values));
    const addTeacher = `INSERT INTO school_metadata.teachers (employee_no, date_of_joining, first_name, middle_name, last_name, gender, subject ) VALUES (?);`;
    const addTeacherResult = await student_metadata_db.query(addTeacher, [
      [
        values.employee_no,
        values.date_of_joining,
        values.first_name,
        values.middle_name,
        values.last_name,
        values.gender,
        values.subject,
      ],
    ]);
    logger.info(
      "teacher/add-teacher | Response | addTeacherResult => " +
        JSON.stringify(addTeacherResult[0]),
    );
    const addTeacherDetails = ``;
    const addTeacherDetailsResult = await student_metadata_db.query(
      addTeacherDetails,
      [[]],
    );
    logger.info(
      "teacher/add-teacher | Response | addTeacherDetailsResult => " +
        JSON.stringify(addTeacherDetailsResult[0]),
    );
    await dbConnection.commit();
    dbConnection.release();
    return res.json({
      status: "Success",
      message: "Teacher added successfully!",
    });
  } catch (error) {
    await dbConnection.rollback();
    dbConnection.release();
    logger.error("teacher/add-teacher | Exception =>> " + error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
