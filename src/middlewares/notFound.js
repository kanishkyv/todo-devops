const ApiError = require("../errors/ApiError");

function notFound(req, res, next) {
  next(
    new ApiError({
      statusCode: 404,
      code: "NOT_FOUND",
      message: `Route not found: ${req.method} ${req.path}`,
    })
  );
}

module.exports = notFound;
