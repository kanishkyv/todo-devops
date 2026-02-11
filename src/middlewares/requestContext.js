const crypto = require("node:crypto");

function requestContext(req, res, next) {
  const incoming = req.header("x-request-id");
  const requestId =
    incoming && incoming.trim() ? incoming.trim() : crypto.randomUUID();

  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
}

module.exports = requestContext;
