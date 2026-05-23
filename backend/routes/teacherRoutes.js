import { Router } from "express";
const router = Router();
import { student_metadata_db } from "../config/db.js";
import logger from "../utils/logger.js";
import { createUserAccount } from "../utils/createUserAccount.js";

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
      password: req.body.password,
      contact_number: req.body.contact_number,
      date_of_joining: req.body.date_of_joining,
      address: req.body.address,
    };
    logger.info("teacher/add-teacher | Request =>> " + JSON.stringify(values));
    const addTeacherQuery = `INSERT INTO school_metadata.teachers (employee_no, date_of_joining, first_name, middle_name, last_name, gender, subject ) VALUES (?);`;
    const addTeacherResult = await dbConnection.query(addTeacherQuery, [
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
    const addedTeacherId = addTeacherResult[0].insertId;
    const { userId } = await createUserAccount(
      dbConnection,
      values.email_id,
      values.password,
    );
    const addUserDetailsQuery = `INSERT INTO school_metadata.user_details (user_id, first_name, middle_name, last_name, gender, contact_number) VALUES (?);`;
    const addUserDetailsResult = await dbConnection.query(addUserDetailsQuery, [
      [
        userId,
        values.first_name,
        values.middle_name,
        values.last_name,
        values.gender,
        values.contact_number,
      ],
    ]);
    logger.info(
      "teacher/add-teacher | Response | addUserDetailsResult => " +
        JSON.stringify(addUserDetailsResult[0]),
    );
    const addTeacherDetailsQuery = `INSERT INTO school_metadata.teacher_details (teacher_id, user_id, email_id, contact_number, address) VALUES (?);`;
    const addTeacherDetailsResult = await dbConnection.query(
      addTeacherDetailsQuery,
      [
        [
          addedTeacherId,
          userId,
          values.email_id,
          values.contact_number,
          values.address,
        ],
      ],
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
    if (error.message.includes("Duplicate entry")) {
      return res
        .status(409)
        .send({ status: "Error", message: "Entered Details Already In Use" });
    } else {
      res
        .status(500)
        .json({ status: "Failed", message: "Internal server error" });
    }
  } finally {
    dbConnection.release();
  }
});

export default router;
