import jwt from "jsonwebtoken";
import logger from "./logger.js";

export default function authenticateToken(req, res, next) {
  try {
    const reqHeaderAuthParam = req.headers["authorization"];
    // const user_token = reqHeaderAuthParam && reqHeaderAuthParam[0];
    // console.log(user_token);
    logger.info("authenticateToken | Request =>> " + reqHeaderAuthParam);

    if (reqHeaderAuthParam && reqHeaderAuthParam === null) {
      return res.sendStatus(403).json({ status: "Failed", message: "Invalid Token Provided" });
    }
    jwt.verify(
      reqHeaderAuthParam,
      process.env.ACCESS_SECRET,
      (err, user_detail) => {
        if (err) {
          logger.error("authenticateToken | " + err.stack);
          return res
            .status(403)
            .json({ status: "Failed", message: "Invalid Token Provided" });
        }
        logger.info(`Token verified for user: ${JSON.stringify(user_detail)}`);
        req.user_id = user_detail.user_id;
        next();
      },
    );
  } catch (error) {
    logger.error(
      "authenticateToken | Response =>> " +
        JSON.stringify({
          request: reqHeaderAuthParam,
          message: error.message,
          path: error.stack,
        }),
    );

    return res.status(403);
  }
}
