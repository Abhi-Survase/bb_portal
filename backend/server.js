import express from "express";
import cors from "cors";
import { student_metadata_db } from "./config/db.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // only allow this origin
  })
);

app.get("/", (req, res) => {
  throw new Error("Incorrect Endpoint! Check API Documentation.");
});

app.get("/favicon.ico", (req, res) => {
  return res.status(204).end;
});

app.get("/all_active_students", async (req, res) => {
  // console.log("takes following req params:","page","limit");
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt(req.query.limit) || 8, 1),
    process.env.VITE_MAX_FETCH_LIMIT
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
    console.log(
      new Date(),
      "INFO",
      "fetchAllStudentData | ",
      `Currentpage: ${page}, limit: ${limit}, offset: ${offset}, totalCount: ${total_studentCount}, totalPages: ${total_pages}`,
      " | Response =>> " + JSON.stringify(dataResult[0])
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
    console.log(
      new Date(),
      " ERROR ",
      "fetchAllStudentData | ",
      `page: ${page}, limit: ${limit}, offset: ${offset}`,
      " | Exception =>> " + err
    );
    return res.status(500).json({
      error: err.message,
      code: err.errno,
    });
  }
});

app.get("/get_student_byAdmissionNo/:admission_no", async (req, res) => {
  try {
    const student_admissionNo = req.params.admission_no;
    console.log(
      new Date(),
      "INFO",
      "getStudentByAdmissionId | Request =>> ",
      "student_admissionNo: " + student_admissionNo
    );
    // const q = `SELECT * FROM school_metadata.students WHERE admission_no = ${student_admissionNo}`; //admission_no = ?`;
    const q = `SELECT * FROM school_metadata.students WHERE admission_no = ?`;
    // const [output] = await student_metadata_db.query(q); //query(q, [student_admissionNo]);
    const [output] = await student_metadata_db.query(q, [student_admissionNo]);
    if (output.length === 0) {
      console.log(
        new Date(),
        " ERROR ",
        "getStudentByAdmissionId | Empty Set returned! | Response =>> " +
          JSON.stringify(output)
      );
      return res.status(404).json({ message: "No Student Found!" });
    }
    console.log(
      new Date(),
      "INFO",
      "getStudentByAdmissionId | Response =>> " + JSON.stringify(output)
    );
    return res.status(200).json(output);
  } catch (err) {
    let status = 500;
    let message = err.message;
    if (err.code == "ER_BAD_FIELD_ERROR") {
      status = 400;
      message = "Enter valid Admission Number!";
    } else {
      status = 400;
      message = "Invalid Input!";
    }
    console.log(
      new Date(),
      " ERROR ",
      "getStudentByAdmissionId | Exception =>> " + err
    );
    return res.status(status).json({
      error: message,
      type: err.code,
      code: err.errno,
    });
  }
});

app.get("/getStudentDetails", async (req, res) => {
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
    console.log(
      new Date(),
      "INFO",
      "getStudentDetails | Request =>> " + JSON.stringify(req.query)
    );
    if (!fieldName) {
      console.log(
        new Date(),
        " ERROR ",
        "getStudentDetails | fieldName=>",
        fieldName,
        "| Exception =>>",
        "Invalid Search Parameter!"
      );
      return res.status(400).json({ message: "Invalid Search Parameter!" });
    }
    if (!detailKeyword || !detailKeyword.trim()) {
      console.log(
        new Date(),
        " ERROR ",
        "getStudentDetails | detailKeyword=>",
        detailKeyword,
        "| Exception =>>",
        "Search Keyword is Required!"
      );
      return res.status(400).json({ message: "Search Keyword is Required!" });
    }
    let finalDetailKeyword = detailKeyword;
    if (["2", "3"].includes(searchParam)) {
      if (detailKeyword.length < 2) {
        console.log(
          new Date(),
          " ERROR ",
          "getStudentDetails | detailKeyword=>",
          detailKeyword,
          "| Exception =>>",
          "Name should have atleast 2 characters!!"
        );
        return res
          .status(400)
          .json({ message: "Name should have atleast 2 characters!" });
      }
      finalDetailKeyword = `%${detailKeyword}%`;
    }
    if (["0", "4"].includes(searchParam)) {
      if (detailKeyword.length <= 4) {
        console.log(
          new Date(),
          " ERROR ",
          "getStudentDetails | detailKeyword=>",
          detailKeyword,
          "| Exception =>>",
          "Enter Atleast 5 digits!"
        );
        return res.status(400).json({ message: "Enter Atleast 5 digits!" });
      }
      // console.log(/^\d+$/.test(detailKeyword), detailKeyword);
      if (!/^\d+$/.test(detailKeyword)) {
        console.log(
          new Date(),
          " ERROR ",
          "getStudentDetails | detailKeyword=>",
          detailKeyword,
          "| Exception =>>",
          "Only Numbers Expected!"
        );
        return res.status(400).json({ message: "Only Numbers Expected!" });
      }
    }
    if (searchParam == 1) {
      if (!/^[0-9]+(-[0-9]+)*$/.test(detailKeyword)) {
        console.log(
          new Date(),
          " ERROR ",
          "getStudentDetails | detailKeyword=>",
          detailKeyword,
          "| Exception =>>",
          "Only Numbers and Hypen Expected!"
        );
        return res
          .status(400)
          .json({ message: "Only Numbers and Hypen Expected!" });
      }
    }
    console.log(
      new Date(),
      "INFO",
      "getStudentDetails | Request Details =>",
      JSON.stringify({ fieldName, detailKeyword })
    );
    const q = `SELECT * FROM school_metadata.students WHERE ${fieldName} like ? ORDER BY ${fieldName} ASC LIMIT 40`;
    const [output] = await student_metadata_db.query(q, [finalDetailKeyword]);
    console.log(
      new Date(),
      "INFO",
      "getStudentDetails | Response =>>",
      JSON.stringify(output)
    );
    if (output.length === 0) {
      console.log(
        new Date(),
        " ERROR ",
        "getStudentDetails | Empty Set Received as Response =>>",
        JSON.stringify(output),
        "No Student Found"
      );
      return res.status(404).json({ message: "No Student Found!" });
    }
    return res.status(200).json(output);
  } catch (err) {
    console.log(
      new Date(),
      " ERROR ",
      "getStudentDetails | Exception =>>",
      err
    );
    return res
      .status(500)
      .json({ status: "Failed", message: "Internal Server Error" });
  }
});

app.post("/add_student", async (req, res) => {
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
    console.log(
      new Date(),
      "INFO",
      "addStudent | Request =>>",
      q,
      `{${values}}`
    );
    await student_metadata_db.query(q, [values]);

    console.log(
      new Date(),
      "INFO",
      "addStudent | Student successfully added to Database!"
    );
    return res.status(201).json({
      status: "Success",
      message: "Student added to Database!",
    });
  } catch (err) {
    let message = err.message;
    console.log(new Date(), " ERROR ", "addStudent | Exception =>>", err);
    if (err.code == "ER_DUP_ENTRY") {
      message = "Admission Number already exists!";
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

app.patch("/updateStudentDetails", async (req, res) => {
  try {
    const requestDetails = req.query ?? "No Request Details Received";
    const output = "Dummy!";
    console.log(
      new Date(),
      "INFO",
      "updateStudentDetails | Request =>>",
      requestDetails
    );
    console.log(
      new Date(),
      "INFO",
      "updateStudentDetails | Response =>>",
      JSON.stringify(output)
    );
    return res.status(201).json("Student record updated Successfully!");
  } catch (err) {
    console.log(
      new Date(),
      " ERROR ",
      "updateStudentDetails | Exception =>>",
      err
    );
    return res.status(501).json({ message: "Internal Server Error" });
  }
});

app.listen(process.env.BACKEND_PORT, () => {
  console.log(
    new Date(),
    "INFO Backend Connected @ Port:" + process.env.BACKEND_PORT
  );
  //   console.log("Connected to db: " + process.env.MYSQL_SCHEMA);
});
