import { Router } from "express";
const router = Router();
import { student_metadata_db } from "../config/db.js";
import logger from "../utils/logger.js";

router.get("/", async (req, res) => {
  function checkCredentials(user_email, user_password) {
    if (user_email === null || user_password === null) {
      return false;
    } else if (user_email.length === 0 || user_password.length === 0) {
      return false;
    }
    return true;
  }
  try {
    const user_email = req.body.email.toLowerCase() || null;
    const user_password = req.body.password || null;
    logger.info(JSON.stringify(req.body));
    if (checkCredentials(user_email, user_password)) {
      const authQuery = `SELECT id FROM users WHERE username = '${user_email}' AND password = '${user_password}'`;
      const authResult = await student_metadata_db.query(authQuery);
      logger.info(JSON.stringify(authResult[0]));
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
