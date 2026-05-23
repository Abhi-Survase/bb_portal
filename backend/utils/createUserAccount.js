import logger from "./logger.js";
import bcrypt from "bcrypt";

export async function createUserAccount(connection, email_id, password) {
  logger.verbose(
    "signupRequest | Request =>> " + JSON.stringify({ email_id, password }),
  );
  const [existingUser] = await connection.query(
    `SELECT id FROM users WHERE email_id = ?`,
    [email_id],
  );
  if (existingUser.length > 0) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const saltValue = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, saltValue);
  logger.info(
    "signupRequest | Request =>> email_id : " +
      email_id +
      " , hashedPassword : " +
      hashedPassword +
      " , salt : " +
      saltValue,
  );
  const signupQuery = `INSERT INTO users (email_id, password, is_deleted) VALUES (?,?,?)`;
  const signupResult = await connection.query(signupQuery, [
    email_id,
    hashedPassword,
    "0",
  ]);
  logger.info("signupResult | Response =>> " + JSON.stringify(signupResult[0]));
  if (signupResult[0].affectedRows > 0) {
    return { userId: signupResult[0].insertId };
  }
}
