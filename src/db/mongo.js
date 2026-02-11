const mongoose = require("mongoose");
const logger = require("../logger");

async function connectMongo(mongoUri) {
  mongoose.set("strictQuery", true);

  mongoose.connection.on("connected", () => logger.info({ msg: "Mongo connected" }));
  mongoose.connection.on("disconnected", () => logger.warn({ msg: "Mongo disconnected" }));
  mongoose.connection.on("error", (err) => logger.error({ err }, "Mongo error"));

  await mongoose.connect(mongoUri);
}

function isMongoReady() {
  // 1 = connected, 2 = connecting
  return mongoose.connection.readyState === 1;
}

async function disconnectMongo() {
  await mongoose.disconnect();
}

module.exports = { connectMongo, disconnectMongo, isMongoReady };
