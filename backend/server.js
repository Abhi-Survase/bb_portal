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
  res.status(204).end;
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
    res.status(200).json({
      data: dataResult[0],
      pagination: {
        totalCount: total_studentCount,
        totalPages: total_pages,
        currentPage: page,
        limit: limit,
      },
    });
    console.log(
      new Date(),
      " INFO ",
      "fetchAllStudentData | ",
      `Currentpage: ${page}, limit: ${limit}, offset: ${offset}, totalCount: ${total_studentCount}, totalPages: ${total_pages}`,
      " | Response =>> " + JSON.stringify(dataResult[0])
    );
  } catch (err) {
    console.log(
      new Date(),
      " ERROR ",
      "fetchAllStudentData | ",
      `page: ${page}, limit: ${limit}, offset: ${offset}`,
      " | Exception =>> " + err
    );
    res.status(500).json({
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
      " INFO ",
      "getStudentByAdmissionId | Request =>> ",
      "student_admissionNo: " + student_admissionNo
    );
    // const q = `SELECT * FROM school_metadata.students WHERE admission_no = ${student_admissionNo}`; //admission_no = ?`;
    const q = `SELECT * FROM school_metadata.students WHERE admission_no = ?`;
    // const [output] = await student_metadata_db.query(q); //query(q, [student_admissionNo]);
    const [output] = await student_metadata_db.query(q, [student_admissionNo]);

    res.status(200).json(output);
    {
      JSON.stringify(output) === "[]"
        ? console.log(
            new Date(),
            " ERROR ",
            "getStudentByAdmissionId | Empty Set returned! | Response =>> " +
              JSON.stringify(output)
          )
        : console.log(
            new Date(),
            " INFO ",
            "getStudentByAdmissionId | Response =>> " + JSON.stringify(output)
          );
    }
  } catch (err) {
    let status = 500;
    let message = err.message;
    if (err.code == "ER_BAD_FIELD_ERROR") {
      status = 400;
      message = "Enter valid Admission Number!";
    } else {
      status = 400;
      message = "Wrong Input! Enter valid Admission Number!";
    }
    res.status(status).json({
      error: message,
      type: err.code,
      code: err.errno,
    });
    console.log(
      new Date(),
      " ERROR ",
      "getStudentByAdmissionId | Exception =>> " + err
    );
    console.log(
      new Date(),
      " ERROR ",
      "getStudentByAdmissionId | Exception =>> " + message
    );
  }
});

app.get("/getStudentDetails", async (req, res) => {
  try {
    const detailParams = [
      "admission_no",
      "date_of_admission",
      "first_name",
      "last_name",
      "contact_number",
    ];
    console.log(
      new Date(),
      " INFO ",
      "getStudentDetails | Request =>> " + JSON.stringify(req.query)
    );
    const searchDetailByParam = detailParams[req.query.searchParam];
    const searchDetailKeyword = req.query.detailKeyword;
    if (
      searchDetailByParam == undefined ||
      searchDetailByParam === "" ||
      searchDetailByParam == null
    ) {
      console.log(
        new Date(),
        " ERROR ",
        "getStudentDetails | searchDetailByParam=> " +
          searchDetailByParam +
          " | Exception =>> " +
          "Invalid Search Parameter!"
      );
      return res.status(400).json("Invalid Search Parameter!");
    } else if (
      searchDetailKeyword == undefined ||
      searchDetailKeyword === "" ||
      searchDetailKeyword == null
    ) {
      console.log(
        new Date(),
        " ERROR ",
        "getStudentDetails | searchDetailKeyword=> " +
          searchDetailKeyword +
          " | Exception =>> " +
          "Empty Search Keyword Recieved!"
      );
      return res.status(400).json("Empty Search Keyword Recieved!");
    }
    const q = `SELECT * FROM school_metadata.students WHERE ${searchDetailByParam} like ?`;
    const [output] = await student_metadata_db.query(q, [searchDetailKeyword]);
    console.log(
      new Date(),
      " INFO ",
      "getStudentDetails | Response =>> " + JSON.stringify(output)
    );
    return res.status(200).json(output);
  } catch (err) {
    console.log(
      new Date(),
      " ERROR ",
      "getStudentDetails | Exception =>> " + err
    );
    return res.status(504).json(err.message);
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
      " INFO ",
      "addStudent | Request =>> ",
      q + " {" + values + "}"
    );
    await student_metadata_db.query(q, [values]);

    console.log(
      new Date(),
      " INFO ",
      "addStudent | Student successfully added to Database!"
    );
    return res.status(200).json("Student successfully added to Database!");
  } catch (err) {
    let message = err.message;
    console.log(new Date(), " ERROR ", "addStudent | Exception =>> " + err);
    if (err.code == "ER_DUP_ENTRY") {
      message = "Student with this Admission Number already exists!";
      res.status(400).json({
        error: message,
        type: err.code,
        code: err.errno,
      });
    } else {
      res.status(400).json({
        error: err.message,
        type: err.code,
        code: err.errno,
      });
    }
  }
});

app.listen(process.env.BACKEND_PORT, () => {
  console.log(
    new Date(),
    "INFO Backend Connected @ Port:" + process.env.BACKEND_PORT
  );
  //   console.log("Connected to db: " + process.env.MYSQL_SCHEMA);
});
