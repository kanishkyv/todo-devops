const request = require("supertest");
const express = require("express");
const { z } = require("zod");

const validate = require("../../middlewares/validate");
const ApiError = require("../../errors/ApiError");

function makeApp() {
  const app = express();
  app.use(express.json());

  app.post(
    "/x",
    validate({ body: z.object({ title: z.string().min(1) }) }),
    (req, res) => res.json({ ok: true })
  );

  // minimal error handler for unit test
  app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).json({ code: err.code, details: err.details });
  });

  return app;
}

test("validate: returns 400 with details when body invalid", async () => {
  const app = makeApp();

  const res = await request(app)
    .post("/x")
    .send({});

  expect(res.statusCode).toBe(400);
  expect(res.body.code).toBe("VALIDATION_ERROR");
  expect(Array.isArray(res.body.details)).toBe(true);
});
