const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const { startMongo, stopMongo } = require("./mongoContainer");

beforeAll(async () => {
  await startMongo();
});

afterAll(async () => {
  await stopMongo();
});
// afterEach(async () => {
//     const collections = mongoose.connection.collections;
//     for (const key in collections) {
//       await collections[key].deleteMany({});
//     }
//   });

test("POST /todos creates a todo (201)", async () => {
  const res = await request(app)
    .post("/todos")
    .send({ title: "buy milk" })
    .expect(201);

  expect(res.body.title).toBe("buy milk");
  expect(res.body.done).toBe(false);
  expect(res.body._id).toBeTruthy();
});

test("GET /todos returns list", async () => {
  await request(app).post("/todos").send({ title: "t1" }).expect(201);

  const res = await request(app).get("/todos").expect(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBeGreaterThan(0);
});

test("invalid POST /todos returns standardized 400", async () => {
  const res = await request(app)
    .post("/todos")
    .send({})
    .expect(400);

  expect(res.body.error.code).toBe("VALIDATION_ERROR");
  expect(res.body.requestId).toBeTruthy();
});
