import { Router } from "express";
const router = Router();
import { student_metadata_db } from "../config/db.js";
import logger from "../utils/logger.js";

router.post("/", async (req, res) => {
  function checkAuthCredentials(email_username, password) {
    logger.info(
      "checkAuthCredentials | Request =>> " +
        JSON.stringify({ email_username, password }),
    );
    if (email_username === null || password === null) {
      return false;
    } else if (email_username.length === 0 || password.length === 0) {
      return false;
    }
    return true;
  }
  try {
    const email_username = req.body.email_username.toLowerCase() || null;
    const password = req.body.password || null;
    if (checkAuthCredentials(email_username, password)) {
      const authQuery = `SELECT id FROM users WHERE username = ? AND password = ? AND is_deleted = 0`;
      const authResult = await student_metadata_db.query(authQuery, [
        email_username,
        password,
      ]);
      logger.info("authResult | Response =>> " + JSON.stringify(authResult[0]));
      if (authResult[0].length > 0) {
        res.send({ status: "Success", message: "Login Request Received!" });
      } else {
        res
          .status(400)
          .send({ status: "Error", message: "Invalid Credentials" });
      }
    } else {
      res.status(400).send({ status: "Error", message: "Invalid Credentials" });
    }
  } catch (error) {
    logger.error(error.stack);
    res.status(500).send({ status: "Error", message: "Internal Server Error" });
  }
});

export default router;
