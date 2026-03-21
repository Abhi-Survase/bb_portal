import { Router } from "express";
const router = Router();
import { student_metadata_db } from "../config/db.js";
import logger from "../utils/logger.js";

router.get("/latest-student-list", async (req, res) => {
  try {
    logger.info("dashboard/latest-student-list | fetching data");
    const latestAdmissionsListQuery =
      "SELECT s.id, s.admission_no, sd.first_name, sd.last_name, sd.gender, sci.parent_contact_number, s.date_of_admission FROM school_metadata.students s JOIN school_metadata.student_details sd ON s.id = sd.student_id JOIN school_metadata.student_contact_info sci ON sd.id = sci.student_detail_id WHERE s.is_active = 1 ORDER BY s.date_of_admission desc, s.id asc LIMIT 5";
    const latestAdmissionsListResult = await student_metadata_db.query(
      latestAdmissionsListQuery,
    );
    logger.info(
      "dashboard/latest-student-list | Response | latestAdmissionsListResult => " +
        JSON.stringify(latestAdmissionsListResult[0]),
    );
    return res.status(200).json({
      data: {
        latestAdmissionsList: latestAdmissionsListResult[0],
      },
    });
    // setTimeout(() => {
    //   logger.info(
    //     "dashboard/latest-student-list | DELAYED Response | latestAdmissionsListResult =>",
    //     JSON.stringify(latestAdmissionsListResult[0]),
    //   );
    //   res.status(200).json({
    //     data: {
    //       latestAdmissionsList: latestAdmissionsListResult[0],
    //     },
    //   });
    // }, 2000);
  } catch (err) {
    logger.error("dashboard/latest-student-list | Exception =>> " + err);
    return res.status(500).json({
      error: "Something Went Wrong",
      code: err.errno,
    });
  }
});

router.get("/student-summary", async (req, res) => {
  try {
    logger.info("dashboard/summary | fetching data");
    const newAdmissionCountQuery =
      "SELECT count(id) as new_admissions_count FROM school_metadata.students WHERE date_of_admission > SUBDATE(sysdate(), INTERVAL 1 MONTH) AND is_active = 1";
    const totalStudentCountQuery =
      "SELECT count(*) as total_count FROM school_metadata.students WHERE is_active = 1";
    const usersCountQuery =
      "SELECT count(*) as users_count FROM school_metadata.users WHERE is_deleted = 0";
    const teachersCountQuery =
      "SELECT count(*) as teachers_count FROM school_metadata.teachers WHERE is_teaching = 1";
    const [
      newAdmissionCountResult,
      totalStudentCountResult,
      usersCountResult,
      teachersCountResult,
    ] = await Promise.all([
      student_metadata_db.query(newAdmissionCountQuery),
      student_metadata_db.query(totalStudentCountQuery),
      student_metadata_db.query(usersCountQuery),
      student_metadata_db.query(teachersCountQuery),
    ]);
    logger.info(
      "dashboard/summary | Response | totalStudentCountResult =>" +
        JSON.stringify(totalStudentCountResult[0]),
    );
    logger.info(
      "dashboard/summary | Response | newAdmissionCountResult =>" +
        JSON.stringify(newAdmissionCountResult[0]),
    );
    logger.info(
      "dashboard/summary | Response | usersCountResult =>" +
        JSON.stringify(usersCountResult[0]),
    );
    logger.info(
      "dashboard/summary | Response | teachersCountResult =>" +
        JSON.stringify(teachersCountResult[0]),
    );
    return res.status(200).json({
      data: {
        newAdmissionCount: newAdmissionCountResult[0],
        totalStudentCount: totalStudentCountResult[0],
        teachersCount: teachersCountResult[0],
        usersCount: usersCountResult[0],
      },
    });
  } catch (err) {
    logger.error("dashboard/summary | Exception =>> " + err);
    return res.status(500).json({
      error: "Something Went Wrong",
      code: err.errno,
    });
  }
});

export default router;
