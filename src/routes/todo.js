const express = require("express");
const validate = require("../middlewares/validate");
const { createTodoBody } = require("./todo.schema");

const router = express.Router();

const Todo = require("../models/Todo");

router.get("/", async (req, res, next) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 }).lean();
    req.log.info({ requestId: req.requestId, count: todos.length }, "Fetched todos");
    res.json(todos);
  } catch (e) {
    next(e);
  }
});

router.post("/", validate({ body: createTodoBody }), async (req, res, next) => {
  try {
    const { title } = req.body;
    const todo = await Todo.create({ title });
    req.log.info({ requestId: req.requestId, todoId: todo._id }, "Created todo");
    res.status(201).json(todo);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
