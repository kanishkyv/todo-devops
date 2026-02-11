const http = require("http");
const app = require("./app");
const config = require("./config");
const logger = require("./logger");
const { connectMongo, disconnectMongo } = require("./db/mongo");

let server;

async function start() {
  await connectMongo(config.mongoUri);

  server = http.createServer(app);

  server.listen(config.port, () => {
    logger.info({ port: config.port }, "Server listening");
  });

  // graceful shutdown
  const shutdown = async (signal) => {
    logger.warn({ signal }, "Shutdown started");
    server.close(async (err) => {
      if (err) logger.error({ err }, "Error closing server");
      try {
        await disconnectMongo();
        logger.info("Mongo disconnected");
      } catch (e) {
        logger.error({ err: e }, "Error disconnecting Mongo");
      } finally {
        process.exit(err ? 1 : 0);
      }
    });

    // Force exit after 10s
    setTimeout(() => {
      logger.error("Force shutdown");
      process.exit(1);
    }, 10_000).unref();
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

start().catch((err) => {
  logger.error({ err }, "Failed to start");
  process.exit(1);
});
