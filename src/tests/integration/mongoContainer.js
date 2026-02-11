const { GenericContainer, Wait } = require("testcontainers");
const { connectMongo, disconnectMongo } = require("../../../src/db/mongo");

let container;

async function startMongo() {
  container = await new GenericContainer("mongo:7")
    .withExposedPorts(27017)
    .withWaitStrategy(Wait.forListeningPorts())
    .start();

  const host = container.getHost();
  const port = container.getMappedPort(27017);
  const uri = `mongodb://${host}:${port}/todo_test`;

  console.log("[test] Mongo container started:", { host, port, uri });

  // If connect hangs, we want it to fail fast (see step 3)
  await connectMongo(uri);
  console.log("[test] Mongoose connected");

  return uri;
}

async function stopMongo() {
  await disconnectMongo();
  if (container) await container.stop();
}

module.exports = { startMongo, stopMongo };
