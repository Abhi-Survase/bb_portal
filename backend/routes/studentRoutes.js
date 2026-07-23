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
  const responseDelay = 2000;
  try {
    const dataQuery =
      "SELECT s.id, s.admission_no, sd.first_name, sci.father_name, sd.last_name, s.date_of_admission, sd.date_of_birth, sd.gender, sd.photo_url, sci.parent_contact_number FROM school_metadata.students s INNER JOIN school_metadata.student_details sd ON s.id = sd.student_id INNER JOIN school_metadata.student_contact_info sci ON sd.id = sci.student_detail_id WHERE s.is_active = 1 ORDER BY s.date_of_admission desc, s.id asc LIMIT ? OFFSET ?";
    const countQuery =
      "SELECT count(*) as total_count FROM school_metadata.students WHERE is_active = 1";
    const [countResult, dataResult] = await Promise.all([
      student_metadata_db.query(countQuery),
      student_metadata_db.query(dataQuery, [limit, offset]),
    ]);
    const total_studentCount = countResult[0][0].total_count;
    const total_pages = Math.ceil(total_studentCount / limit);
    // console.log(countResult[0][0].total_count, dataResult[0]);
    // logger.info(
    //   "fetchAllStudentData | " +
    //     `Currentpage: ${page}, limit: ${limit}, offset: ${offset}, totalCount: ${total_studentCount}, totalPages: ${total_pages}` +
    //     " | Response =>> " +
    //     JSON.stringify(dataResult[0]),
    // );
    //   return res.status(200).json({
    //     data: dataResult[0],
    //     pagination: {
    //       totalCount: total_studentCount,
    //       totalPages: total_pages,
    //       currentPage: page,
    //       limit: limit,
    //     },
    //   });
    logger.info(
      "fetchAllStudentData | " +
        `Currentpage: ${page}, limit: ${limit}, offset: ${offset}, totalCount: ${total_studentCount}, totalPages: ${total_pages}` +
        ` | Response DELAYED by ${responseDelay}ms =>> ` +
        JSON.stringify(dataResult[0]),
    );
    setTimeout(() => {
      return res.status(200).json({
        data: dataResult[0],
        pagination: {
          totalCount: total_studentCount,
          totalPages: total_pages,
          currentPage: page,
          limit: limit,
        },
      });
    }, responseDelay);
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
    const q = `SELECT s.id, s.admission_no, sd.first_name, sci.father_name, sd.last_name, s.date_of_admission, sd.date_of_birth, sd.gender, sd.photo_url, sci.parent_contact_number FROM school_metadata.students s INNER JOIN school_metadata.student_details sd ON s.id = sd.student_id INNER JOIN school_metadata.student_contact_info sci ON sd.id = sci.student_detail_id WHERE ${fieldName} like ? ORDER BY ${fieldName} ASC LIMIT 40`;
    const [output] = await student_metadata_db.query(q, [finalDetailKeyword]);
    logger.info("searchStudent | Response =>> " + JSON.stringify(output));
    if (output.length === 0) {
      logger.warn(
        "searchStudent | No Student Found | Empty Set Received as Response =>> " +
          JSON.stringify(output),
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
    const q =
      "SELECT s.id, s.admission_no, sd.id as sd_id, sci.id as sci_id, sad.id as sad_id, sd.first_name, sci.father_name, sci.mother_name, sd.last_name, s.date_of_admission, sd.date_of_birth, sd.gender, sd.disability, s.is_active, sd.photo_url, sci.parent_contact_number, sci.parent_email, sad.permanent_address, sad.city, sad.state, sad.pincode FROM school_metadata.students s INNER JOIN school_metadata.student_details sd ON s.id = sd.student_id INNER JOIN school_metadata.student_contact_info sci ON sd.id = sci.student_detail_id INNER JOIN school_metadata.student_address_details sad ON sci.id = sad.student_contact_id WHERE s.admission_no = ?";
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
      message = "Invalid Admission Number!";
    } else {
      status = 400;
      message = "Invalid Reqest Received!";
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
  const dbConnection = await student_metadata_db.getConnection();
  try {
    await dbConnection.beginTransaction();
    const values = {
      admission_no: req.body.admission_no,
      date_of_admission: req.body.date_of_admission,
      first_name: req.body.first_name,
      father_name: req.body.father_name,
      mother_name: req.body.mother_name,
      last_name: req.body.last_name,
      date_of_birth: req.body.date_of_birth,
      gender: req.body.gender,
      parent_contact_number: req.body.parent_contact_number,
      parent_email: req.body.parent_email,
      permanent_address: req.body.permanent_address,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      disability: req.body.disability,
    };
    // logger.info("addStudent | Request =>> " + JSON.stringify(values));
    const studentQuery =
      "INSERT INTO students (`admission_no`,`date_of_admission`) VALUES (?)";
    const studentDetailsQuery =
      "INSERT INTO student_details (`student_id`,`first_name`,`last_name`,`date_of_birth`,`gender`,`disability`,`photo_url`) VALUES (?)";
    const studentContactInfoQuery =
      "INSERT INTO student_contact_info (`student_detail_id`,`father_name`,`mother_name`,`parent_contact_number`,`parent_email`) VALUES (?)";
    const studentAddressDetailsQuery =
      "INSERT INTO student_address_details (`student_contact_id`,`permanent_address`,`city`,`state`,`pincode`) VALUES (?)";
    logger.info(
      "addStudent | studentQuery =>> " +
        studentQuery +
        " | student data =>> " +
        values.admission_no +
        "," +
        values.date_of_admission,
    );
    // console.log([values.admission_no, values.date_of_admission],[[values.admission_no, values.date_of_admission]])
    const studentResult = await dbConnection.query(studentQuery, [
      [values.admission_no, values.date_of_admission],
    ]);
    logger.info(JSON.stringify(studentResult));
    logger.info(
      "addStudent | studentDetailsQuery =>> " +
        studentDetailsQuery +
        " | student data =>> " +
        studentResult[0].insertId +
        "," +
        values.first_name +
        "," +
        values.last_name +
        "," +
        values.date_of_birth +
        "," +
        values.gender +
        "," +
        values.disability +
        "," +
        null,
    );
    const studentDetailsResult = await dbConnection.query(studentDetailsQuery, [
      [
        studentResult[0].insertId,
        values.first_name,
        values.last_name,
        values.date_of_birth,
        values.gender,
        values.disability,
        null,
      ],
    ]);
    logger.info(JSON.stringify(studentDetailsResult));
    logger.info(
      "addStudent | studentContactInfoQuery =>> " +
        studentContactInfoQuery +
        " | student data =>> " +
        studentDetailsResult[0].insertId +
        "," +
        values.mother_name +
        "," +
        values.father_name +
        "," +
        values.parent_contact_number +
        "," +
        values.parent_email,
    );
    const studentContactInfoResult = await dbConnection.query(
      studentContactInfoQuery,
      [
        [
          studentDetailsResult[0].insertId,
          values.mother_name,
          values.father_name,
          values.parent_contact_number,
          values.parent_email,
        ],
      ],
    );
    logger.info(JSON.stringify(studentContactInfoResult));
    logger.info(
      "addStudent | studentAddressDetailsQuery =>> " +
        studentAddressDetailsQuery +
        " | student data =>> " +
        studentContactInfoResult[0].insertId +
        "," +
        values.permanent_address +
        "," +
        values.city +
        "," +
        values.state +
        "," +
        values.pincode,
    );
    const studentAddressDetailsResult = await dbConnection.query(
      studentAddressDetailsQuery,
      [
        [
          studentContactInfoResult[0].insertId,
          values.permanent_address,
          values.city,
          values.state,
          values.pincode,
        ],
      ],
    );
    logger.info(JSON.stringify(studentContactInfoResult));
    await dbConnection.commit();
    logger.info("addStudent | Student added to Database!");
    dbConnection.release();
    return res.status(201).json({
      status: "Success",
      message: "Student added to Database!",
    });
  } catch (err) {
    await dbConnection.rollback();
    dbConnection.release();
    let message = err.message;
    logger.error(
      "addStudent | admission_no: " +
        req.body.admission_no +
        " | Exception =>> " +
        err.stack,
    );
    if (err.code === "ER_DUP_ENTRY") {
      message = `Admission ${req.body.admission_no} already in use!`;
      res.status(400).json({
        status: "Failed",
        error: message,
      });
    } else {
      res.status(400).json({
        status: "Failed",
        error: err.message,
      });
    }
  }
});

router.put("/update-student-details", async (req, res) => {
  const dbConnection = await student_metadata_db.getConnection();
  try {
    await dbConnection.beginTransaction();
    const values = {
      id: req.body.id,
      admission_no: req.body.admission_no,
      sd_id: req.body.sd_id,
      sci_id: req.body.sci_id,
      sad_id: req.body.sad_id,
      date_of_admission: req.body.date_of_admission,
      first_name: req.body.first_name,
      father_name: req.body.father_name,
      mother_name: req.body.mother_name,
      last_name: req.body.last_name,
      date_of_birth: req.body.date_of_birth,
      gender: req.body.gender,
      parent_contact_number: req.body.parent_contact_number,
      parent_email: req.body.parent_email,
      permanent_address: req.body.permanent_address,
      photo_url: req.body.photo_url,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      disability: req.body.disability,
      is_active: req.body.is_active,
    };
    // logger.info("updateStudentDetail | Request =>> " + JSON.stringify(values));
    const studentQuery =
      "UPDATE students SET `is_active` = ? WHERE `admission_no` = ?";
    const studentDetailsQuery =
      "UPDATE student_details SET `first_name` = ? ,`last_name` = ? ,`date_of_birth` = ? ,`gender` = ? ,`disability` = ? ,`photo_url` = ? WHERE `id` = ?";
    const studentContactInfoQuery =
      "UPDATE student_contact_info SET `father_name` = ? ,`mother_name` = ? ,`parent_contact_number` = ? ,`parent_email` = ? WHERE `id` = ?";
    const studentAddressDetailsQuery =
      "UPDATE student_address_details SET `permanent_address` = ? ,`city` = ? ,`state` = ? ,`pincode` = ? WHERE `id` = ?";
    logger.info(
      "updateStudent | studentQuery =>> " +
        studentQuery +
        " | student data =>> " +
        values.is_active +
        "," +
        values.admission_no,
    );
    const studentResult = await dbConnection.query(studentQuery, [
      values.is_active,
      values.admission_no,
    ]);
    logger.info(JSON.stringify(studentResult));
    logger.info(
      "updateStudentDetail | studentDetailsQuery =>> " +
        studentDetailsQuery +
        " | student data =>> " +
        values.first_name +
        "," +
        values.last_name +
        "," +
        values.date_of_birth +
        "," +
        values.gender +
        "," +
        values.disability +
        "," +
        values.photo_url +
        "," +
        values.sd_id,
    );
    const studentDetailsResult = await dbConnection.query(studentDetailsQuery, [
      values.first_name,
      values.last_name,
      values.date_of_birth,
      values.gender,
      values.disability,
      values.photo_url,
      values.sd_id,
    ]);
    logger.info(JSON.stringify(studentDetailsResult));
    logger.info(
      "updateStudentDetail | studentContactInfoQuery =>> " +
        studentContactInfoQuery +
        " | student data =>> " +
        values.father_name +
        "," +
        values.mother_name +
        "," +
        values.parent_contact_number +
        "," +
        values.parent_email +
        "," +
        values.sd_id,
    );
    const studentContactInfoResult = await dbConnection.query(
      studentContactInfoQuery,
      [
        values.father_name,
        values.mother_name,
        values.parent_contact_number,
        values.parent_email,
        values.sci_id,
      ],
    );
    logger.info(JSON.stringify(studentContactInfoResult));
    logger.info(
      "updateStudentDetail | studentAddressDetailsQuery =>> " +
        studentAddressDetailsQuery +
        " | student data =>> " +
        values.permanent_address +
        "," +
        values.city +
        "," +
        values.state +
        "," +
        values.pincode +
        "," +
        values.sad_id,
    );
    const studentAddressDetailsResult = await dbConnection.query(
      studentAddressDetailsQuery,
      [
        values.permanent_address,
        values.city,
        values.state,
        values.pincode,
        values.sad_id,
      ],
    );
    logger.info(JSON.stringify(studentContactInfoResult));
    await dbConnection.commit();
    logger.info(
      "updateStudentDetail | admission_no: " +
        req.body.admission_no +
        " | Student details updated!",
    );
    dbConnection.release();
    return res.status(201).json({
      status: "Success",
      message: "Student details updated!",
    });
  } catch (err) {
    await dbConnection.rollback();
    dbConnection.release();
    logger.error(
      "updateStudentDetail | admission_no: " +
        req.body.admission_no +
        " | Exception =>> " +
        err.stack,
    );
    res.status(400).json({
      status: "Failed",
      error: "Something went wrong",
    });
  }
});

export default router;
