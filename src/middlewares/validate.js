const ApiError = require("../errors/ApiError");

function formatZodError(zodError) {
  return zodError.issues.map((i) => ({
    path: i.path.join(".") || "(root)",
    message: i.message,
  }));
}

function validate({ body, params, query }) {
  return (req, res, next) => {
    try {
      if (body) req.body = body.parse(req.body);
      if (params) req.params = params.parse(req.params);
      if (query) req.query = query.parse(req.query);
      return next();
    } catch (err) {
      // zod error
      if (err?.issues) {
        return next(
          new ApiError({
            statusCode: 400,
            code: "VALIDATION_ERROR",
            message: "Invalid request",
            details: formatZodError(err),
          })
        );
      }
      return next(err);
    }
  };
}

module.exports = validate;
