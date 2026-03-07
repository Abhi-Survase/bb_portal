import winston from "winston";
const { combine, timestamp, printf, colorize, align } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  const capitalizedLevel = level.toUpperCase();
  return `[${timestamp}] ${capitalizedLevel} ${message}`;
});
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:ss.SSS",
    }),
    logFormat,
    colorize({ all: true }),
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
