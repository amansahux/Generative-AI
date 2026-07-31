/**
 * @file models/message.model.js
 * @description Mongoose schema and model for a Chat Message.
 * Stores individual messages (human or AI) linked to a Chat Session.
 */

import mongoose from "mongoose";

/**
 * Enumerated roles for a message sender.
 * - "user"  : message authored by the human
 * - "ai"    : message authored by the AI
 * - "system": system-level message (instructions, context, etc.)
 */
const ROLE_ENUM = ["user", "ai", "system"];

const messageSchema = new mongoose.Schema(
  {
    /** Chat session this message belongs to */
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },

    /** Sender role */
    role: {
      type: String,
      enum: ROLE_ENUM,
      required: true,
    },

    /** Raw text content of the message */
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
