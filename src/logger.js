const pino = require("pino");
const config = require("./config");

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  base: {
    service: config.serviceName,
    env: config.env,
  },
  // Makes local logs readable; in prod, remove or keep JSON only
  transport:
    config.env === "development"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
});

module.exports = logger;
