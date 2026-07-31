/**
 * @file models/snippet.model.js
 * @description Mongoose schema and model for a Code Snippet.
 * Represents a saved code snippet created or collected by the user.
 */

import mongoose from "mongoose";

const snippetSchema = new mongoose.Schema(
  {
    /** Owner of the snippet */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },

    /** Brief label for the snippet */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    /** Programming language of the snippet (e.g. "javascript", "python") */
    language: {
      type: String,
      default: "plaintext",
      trim: true,
    },

    /** The raw code content */
    code: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Snippet = mongoose.model("Snippet", snippetSchema);

export default Snippet;
