import app from "./app.js";
import logger from "./utils/logger.js";

app.listen(process.env.BACKEND_PORT, () => {
  logger.info("Backend Connected @ Port:" + process.env.BACKEND_PORT);
});
