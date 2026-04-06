import express from "express";
import cors from "cors";
// import { student_metadata_db } from "./config/db.js";
import logger from "./utils/logger.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", // only allow this origin
  }),
);

app.use((req, res, next) => {
  logger.info(`Request Received: ${req.method} ${req.url}`);
  next();
});

app.get("/favicon.ico", (req, res) => {
  return res.status(204).end;
});

app.use("/dashboard", dashboardRoutes);

app.use("/student", studentRoutes);

export default app;
