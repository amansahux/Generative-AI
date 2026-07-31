/**
 * @file models/chat.model.js
 * @description Mongoose schema and model for a Chat Session.
 * A session groups a sequence of messages between a user and the AI.
 */

import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    /** Reference to the authenticated user who owns this session */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },

    /** Human-readable title for the session (auto-generated or user-defined) */
    title: {
      type: String,
      default: "New Chat",
      trim: true,
    },

    /** Soft-delete flag */
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    /** Automatically manages createdAt and updatedAt timestamps */
    timestamps: true,
  }
);

const ChatModel = mongoose.model("chats", chatSchema);

export default ChatModel;
