import { Router } from "express";
const router = Router();
import { student_metadata_db } from "../config/db.js";
import logger from "../utils/logger.js";

router.get("/active-students", async (req, res) => {
  // console.log("takes following req params:","page","limit");
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt(req.query.limit) || 8, 1),
    process.env.VITE_MAX_FETCH_LIMIT,
  );
  const offset = (page - 1) * limit;
  // console.log(page, limit, offset);
  try {
    const dataQuery =
      "SELECT * FROM school_metadata.students WHERE is_active = 'true' ORDER BY date_of_admission desc, id asc LIMIT ? OFFSET ?";
    const countQuery =
      "SELECT count(*) as total_count FROM school_metadata.students WHERE is_active = 'true'";
    const [countResult, dataResult] = await Promise.all([
      student_metadata_db.query(countQuery),
      student_metadata_db.query(dataQuery, [limit, offset]),
    ]);
    const total_studentCount = countResult[0][0].total_count;
    const total_pages = Math.ceil(total_studentCount / limit);
    // console.log(countResult[0][0].total_count, dataResult[0]);
    logger.info(
      "fetchAllStudentData | " +
        `Currentpage: ${page}, limit: ${limit}, offset: ${offset}, totalCount: ${total_studentCount}, totalPages: ${total_pages}` +
        " | Response =>> " +
        JSON.stringify(dataResult[0]),
    );
    return res.status(200).json({
      data: dataResult[0],
      pagination: {
        totalCount: total_studentCount,
        totalPages: total_pages,
        currentPage: page,
        limit: limit,
      },
    });
  } catch (err) {
    logger.error(
      "fetchAllStudentData | " +
        `page: ${page}, limit: ${limit}, offset: ${offset}` +
        " | Exception =>> " +
        err.stack,
    );
    return res.status(500).json({
      error: err.message,
      code: err.errno,
    });
  }
});

router.get("/search-student", async (req, res) => {
  try {
    const { searchParam, detailKeyword } = req.query;
    const SEARCH_FIELDS = [
      "admission_no",
      "date_of_admission",
      "first_name",
      "last_name",
      "contact_number",
    ];
    const fieldName = SEARCH_FIELDS[searchParam];
    logger.info("searchStudent | Request =>> " + JSON.stringify(req.query));
    if (!fieldName) {
      logger.error(
        "searchStudent | fieldName=> " +
          fieldName +
          " | Exception =>> " +
          "Invalid Search Parameter!",
      );
      return res.status(400).json({ message: "Invalid Search Parameter!" });
    }
    if (!detailKeyword || !detailKeyword.trim()) {
      logger.error(
        "searchStudent | detailKeyword=> " +
          detailKeyword +
          " | Exception =>> " +
          "Search Keyword is Required!",
      );
      return res.status(400).json({ message: "Search Keyword is Required!" });
    }
    let finalDetailKeyword = detailKeyword;
    if (["2", "3"].includes(searchParam)) {
      if (detailKeyword.length < 2) {
        logger.error(
          "searchStudent | detailKeyword=> " +
            detailKeyword +
            " | Exception =>> " +
            "Name should have atleast 2 characters!!",
        );
        return res
          .status(400)
          .json({ message: "Name should have atleast 2 characters!" });
      }
      finalDetailKeyword = `%${detailKeyword}%`;
    }
    if (["0", "4"].includes(searchParam)) {
      if (detailKeyword.length <= 4) {
        logger.error(
          "searchStudent | detailKeyword=> " +
            detailKeyword +
            " | Exception =>> " +
            "Enter Atleast 5 digits!",
        );
        return res.status(400).json({ message: "Enter Atleast 5 digits!" });
      }
      // console.log(/^\d+$/.test(detailKeyword), detailKeyword);
      if (!/^\d+$/.test(detailKeyword)) {
        logger.error(
          "searchStudent | detailKeyword=> " +
            detailKeyword +
            " | Exception =>> " +
            "Only Numbers Expected!",
        );
        return res.status(400).json({ message: "Only Numbers Expected!" });
      }
      finalDetailKeyword = `${detailKeyword}%`;
    }
    if (searchParam == 1) {
      if (!/^[0-9]+(-[0-9]+)*$/.test(detailKeyword)) {
        logger.error(
          "searchStudent | detailKeyword=>" +
            detailKeyword +
            " | Exception =>> " +
            "Only Numbers and Hypen Expected!",
        );
        return res
          .status(400)
          .json({ message: "Only Numbers and Hypen Expected!" });
      }
    }
    logger.info(
      "searchStudent | Request Details => " +
        JSON.stringify({ fieldName, finalDetailKeyword }),
    );
    const q = `SELECT * FROM school_metadata.students WHERE ${fieldName} like ? ORDER BY ${fieldName} ASC LIMIT 40`;
    const [output] = await student_metadata_db.query(q, [finalDetailKeyword]);
    logger.info("searchStudent | Response =>> " + JSON.stringify(output));
    if (output.length === 0) {
      logger.error(
        "searchStudent | Empty Set Received as Response =>> " +
          JSON.stringify(output) +
          "No Student Found",
      );
      return res.status(404).json({ message: "No Student Found!" });
    }
    return res.status(200).json(output);
  } catch (err) {
    logger.error("searchStudent | Exception =>> " + err.stack);
    return res
      .status(500)
      .json({ status: "Failed", message: "Internal Server Error" });
  }
});

router.get("/get-student-by-admissionNo/:admission_no", async (req, res) => {
  try {
    const student_admissionNo = req.params.admission_no;
    logger.info(
      "getStudentByAdmissionId | Request =>> " +
        "student_admissionNo: " +
        student_admissionNo,
    );
    // const q = `SELECT * FROM school_metadata.students WHERE admission_no = ${student_admissionNo}`; //admission_no = ?`;
    const q = `SELECT * FROM school_metadata.students WHERE admission_no = ?`;
    // const [output] = await student_metadata_db.query(q); //query(q, [student_admissionNo]);
    const [output] = await student_metadata_db.query(q, [student_admissionNo]);
    if (output.length === 0) {
      logger.error(
        "getStudentByAdmissionId | Empty Set returned! | Response =>> " +
          JSON.stringify(output) +
          " | No Student Found!",
      );
      return res.status(404).json({ message: "No Student Found!" });
    }
    logger.info(
      "getStudentByAdmissionId | Response =>> " + JSON.stringify(output),
    );
    return res.status(200).json(output);
  } catch (err) {
    let status = 500;
    let message = err.message;
    if (err.code == "ER_BAD_FIELD_ERROR") {
      status = 400;
      message = "Enter Valid Admission Number!";
    } else {
      status = 400;
      message = "Invalid Input!";
    }
    logger.error("getStudentByAdmissionId | Exception =>> " + err.stack);
    return res.status(status).json({
      error: message,
      type: err.code,
      code: err.errno,
    });
  }
});

router.post("/add-student", async (req, res) => {
  try {
    const q =
      "INSERT INTO students (`admission_no`,`date_of_admission`,`first_name`,`middle_name`,`mother_name`,`last_name`,`d_o_b`,`gender`,`contact_number`,`address`,`city`,`state`,`pincode`,`disability`) VALUES (?)";
    const values = [
      req.body.admission_no,
      req.body.date_of_admission,
      req.body.first_name,
      req.body.middle_name,
      req.body.mother_name,
      req.body.last_name,
      req.body.d_o_b,
      req.body.gender,
      req.body.contact_number,
      req.body.address,
      req.body.city,
      req.body.state,
      req.body.pincode,
      req.body.disability,
    ];
    logger.info("addStudent | Request =>> " + q + `{${values}}`);
    await student_metadata_db.query(q, [values]);

    logger.error(
      "addStudent | admission_no: " +
        req.body.admission_no +
        " | Student successfully added to Database!",
    );
    return res.status(201).json({
      status: "Success",
      message: "Student added to Database!",
    });
  } catch (err) {
    let message = err.message;
    logger.error(
      "addStudent | admission_no: " +
        req.body.admission_no +
        " | Exception =>> " +
        JSON.stringify(message),
    );
    if (err.code === "ER_DUP_ENTRY") {
      message = "Admission already exists!";
      res.status(400).json({
        error: message,
      });
    } else {
      res.status(400).json({
        error: err.message,
      });
    }
  }
});

router.patch("/update-student-details", async (req, res) => {
  try {
    const requestDetails = req.query ?? "No Request Details Received";
    const output = "Dummy!";
    logger.error("updateStudentDetails | Request =>>" + requestDetails);
    logger.error(
      "updateStudentDetails | Response =>>" + JSON.stringify(output),
    );
    return res.status(201).json("Student record updated Successfully!");
  } catch (err) {
    logger.error("updateStudentDetails | Exception =>>" + err.stack);
    return res.status(501).json({ message: "Internal Server Error" });
  }
});

export default router;
