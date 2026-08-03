/**
 * @file models/todo.model.js
 * @description Mongoose schema and model for a Todo item.
 * Represents a task created by the user (potentially via AI tooling).
 */

import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    /** Owner of the todo item */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },

    /** Short description of the task */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    /** Whether the task has been completed */
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Todo = mongoose.model("todos", todoSchema);

export default Todo;
