const { z } = require("zod");

const createTodoBody = z.object({
  title: z.string().min(1, "title is required").max(200, "title too long"),
});

module.exports = { createTodoBody };
