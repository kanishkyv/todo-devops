const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    done: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Todo || mongoose.model("Todo", TodoSchema);
