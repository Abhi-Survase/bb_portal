import { Router } from "express";
const router = Router();
import { student_metadata_db } from "../config/db.js";
import logger from "../utils/logger.js";

router.post("/login", async (req, res) => {
  function checkLoginCredentials(email_id, password) {
    logger.info(
      "checkLoginCredentials | Request =>> " +
        JSON.stringify({ email_id, password }),
    );
    if (email_id === null || password === null) {
      return false;
    } else if (email_id.length === 0 || password.length === 0) {
      return false;
    }
    return true;
  }
  try {
    const email_id = req.body.email_id.toLowerCase() || null;
    const password = req.body.password || null;
    if (checkLoginCredentials(email_id, password)) {
      const loginQuery = `SELECT id FROM users WHERE email_id = ? AND password = ? AND is_deleted = 0`;
      const loginResult = await student_metadata_db.query(loginQuery, [
        email_id,
        password,
      ]);
      logger.info(
        "loginResult | Response =>> " + JSON.stringify(loginResult[0]),
      );
      if (loginResult[0].length > 0) {
        return res.send({
          status: "Success",
          message: "Login Request Received!",
        });
      } else {
        return res
          .status(400)
          .send({ status: "Error", message: "Invalid Credentials" });
      }
    } else {
      return res
        .status(400)
        .send({ status: "Error", message: "Invalid Credentials" });
    }
  } catch (error) {
    logger.error("loginResult | Response =>> " + error.message);
    logger.error(error.stack);
    return res
      .status(500)
      .send({ status: "Error", message: "Internal Server Error" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const email_id = req.body.email_id || null;
    const password = req.body.password || null;
    logger.info("signupRequest | Request =>> " + JSON.stringify(req.body));
    if (email_id === null || password === null) {
      return res
        .status(400)
        .send({ status: "Error", message: "Incomplete Credentials Received" });
    }
    const signupQuery = `INSERT INTO users (email_id, password, is_deleted) VALUES (?,?,?)`;
    const signupResult = await student_metadata_db.query(signupQuery, [
      email_id,
      password,
      "0",
    ]);
    logger.info(
      "signupResult | Response =>> " + JSON.stringify(signupResult[0]),
    );
    if (signupResult[0].affectedRows > 0) {
      return res
        .status(201)
        .send({ status: "Success", message: "User Added to Database!" });
    } else {
      return res
        .status(400)
        .send({ status: "Error", message: "Something Went Wrong" });
    }
  } catch (error) {
    logger.error("signupResult | Response =>> " + error.message);
    logger.error(error.stack);
    if (error.message.includes("Duplicate entry")) {
      return res
        .status(409)
        .send({ status: "Error", message: "Entered Email Already In Use" });
    } else {
      return res
        .status(500)
        .send({ status: "Error", message: "Internal Server Error" });
    }
  }
});

export default router;
