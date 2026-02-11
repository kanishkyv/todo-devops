require("dotenv").config();

function must(name, value) {
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

const config = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),
  mongoUri: must("MONGO_URI", process.env.MONGO_URI),
  serviceName: process.env.SERVICE_NAME || "todo-api",
};

module.exports = config;
