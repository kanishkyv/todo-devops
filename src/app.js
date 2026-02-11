const express = require("express");
const pinoHttp = require("pino-http");
const logger = require("./logger");
const ApiError = require("./errors/ApiError");
const notFound = require("./middlewares/notFound");
const requestContext = require("./middlewares/requestContext");
const { isMongoReady } = require("./db/mongo");

const todosRouter = require("./routes/todo");

const app = express();
app.use(requestContext);
app.use(express.json());


// Auto request logging (structured)
app.use(
  pinoHttp({
    logger,
    customProps: (req) => ({
      requestId: req.requestId,
    }),
    serializers: {
      req(req) {
        return {
          method: req.method,
          url: req.url,
          headers: {
            "user-agent": req.headers["user-agent"],
            "x-request-id": req.headers["x-request-id"],
          },
        };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  })
);


// Health: process up
app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true });
});

// Ready: deps ready (Mongo)
app.get("/readyz", (req, res) => {
  if (!isMongoReady()) return res.status(503).json({ ok: false, mongo: "down" });
  res.status(200).json({ ok: true, mongo: "up" });
});

// routes
app.use("/todos", todosRouter);
app.use(notFound);

// Error handler (structured)
app.use((err, req, res, next) => {
    const requestId = req.requestId;
  
    // If it’s our known error, use it; otherwise treat as 500
    const statusCode = err.statusCode || 500;
    const code = err.code || "INTERNAL_SERVER_ERROR";
    const message = statusCode === 500 ? "Something went wrong" : err.message;
    console.log("erroroororor",err);
    // Log full error server-side (with stack)
    req.log.error(
      { err, requestId, statusCode, code },
      "Request failed"
    );
  
    res.status(statusCode).json({
      error: {
        code,
        message,
        ...(err.details ? { details: err.details } : {}),
      },
      requestId,
    });
  });

module.exports = app;
