import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const student_metadata_db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_SCHEMA,
  port: process.env.MYSQL_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 5,
});

(async () => {
  try {
    const connection = await student_metadata_db.getConnection();
    console.log(new Date(), "INFO Connection Successful with DB");
    connection.release(); // release back to pool
  } catch (err) {
    console.error(
      new Date(),
      "ERROR - Connection failed with DB:",
      err.message
    );
  }
})();
