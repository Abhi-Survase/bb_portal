import { Router } from "express";
const router = Router();
import { student_metadata_db } from "../config/db.js";
import logger from "../utils/logger.js";

router.get("/latest-student-list", async (req, res) => {
  try {
    logger.info("dashboard/latest-student-list | fetching data");
    const latestAdmissionsListQuery =
      "SELECT id, admission_no, first_name, last_name, gender, contact_number, date_of_admission FROM school_metadata.students WHERE is_active = 'true' ORDER BY date_of_admission desc, id asc LIMIT 5";
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
      "SELECT count(id) as new_admissions_count FROM school_metadata.students WHERE date_of_admission > SUBDATE(sysdate(), INTERVAL 1 MONTH) AND is_active = 'true'";
    const totalStudentCountQuery =
      "SELECT count(*) as total_count FROM school_metadata.students WHERE is_active = 'true'";
    const [newAdmissionCountResult, totalStudentCountResult] =
      await Promise.all([
        student_metadata_db.query(newAdmissionCountQuery),
        student_metadata_db.query(totalStudentCountQuery),
      ]);
    logger.info(
      "dashboard/summary | Response | totalStudentCountResult =>" +
        JSON.stringify(totalStudentCountResult[0]),
    );
    logger.info(
      "dashboard/summary | Response | newAdmissionCountResult =>" +
        JSON.stringify(newAdmissionCountResult[0]),
    );
    return res.status(200).json({
      data: {
        newAdmissionCount: newAdmissionCountResult[0],
        totalStudentCount: totalStudentCountResult[0],
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
