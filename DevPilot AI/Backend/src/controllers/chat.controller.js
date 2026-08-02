/**
 * @file controllers/chat.controller.js
 * @description Concrete controller implementations for DevPilot AI chat endpoints.
 * Uses Mongoose models (ChatModel, MessageModel) and AI service helpers
 * (GenerateResponse, GenerateSession) to manage sessions, messages, and
 * AI interactions.
 */

import ChatModel from "../models/chat.model.js";
import MessageModel from "../models/message.model.js";
import { GenerateResponse, GenerateSession } from "../services/ai.service.js";
// Global error handling utilities

import { ApiError, asyncHandler } from "../middleware/error.middleware.js";



/**
 * Send a message and receive an AI response.
 * @route  POST /api/chat/message
 * Expected body: { sessionId: string, content: string }
 */
export const sendMessage = asyncHandler(async (req, res) => {
  let { sessionId, content } = req.body;
  const userId = req.user?.id || req.body?.userId;
  if (!userId) {
    throw new ApiError(400, "User identifier missing");
  }

  // If sessionId is not provided, create a new chat session for the user
  if (!sessionId) {
    /**
 * Create a new chat session.
 * @route  POST /api/chat/session
 */
    const newSession = await ChatModel.create({ userId, title: "New Chat" });
    sessionId = newSession._id.toString();
  }

  const session = await ChatModel.findOne({ _id: sessionId, isDeleted: false });
  if (!session) {
    throw new ApiError(404, "Chat session not found")
  }
  if (!content) {
    throw new ApiError(400, "Message content is required")
  }
  await MessageModel.create({ sessionId, role: "user", content });

  const rawAllMessages = await MessageModel.find({ sessionId })
    .sort({ createdAt: 1 })
    .lean();

  const aiResponse = await GenerateResponse(rawAllMessages);

  await MessageModel.create({ sessionId, role: "ai", content: aiResponse });

  const title = await GenerateSession(content, aiResponse);
  if (title) await ChatModel.findByIdAndUpdate(sessionId, { title });

  return res.status(200).json({ success: true, data: aiResponse });
});

/**
 * Retrieve all chat sessions for the authenticated user.
 * @route  GET  /api/v1/chat/sessions
 */
export const getSessions = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.query?.userId;
  if (!userId) {
    throw new ApiError(400, "User identifier missing")
  }

  const sessions = await ChatModel.find({ userId, isDeleted: false })
    .sort({ updatedAt: -1 })
    .lean();
  return res.status(200).json({ success: true, data: sessions });
});

/**
 * Retrieve the message history of a specific chat session.
 * @route  GET  /api/v1/chat/session/:sessionId
 */
export const getSessionHistory = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  if (!sessionId) {
    throw new ApiError(400, "sessionId is required")
  }

  const messages = await MessageModel.find({ sessionId })
    .sort({ createdAt: 1 })
    .lean();
  return res.status(200).json({ success: true, data: messages });
});

/**
 * Delete a specific chat session (soft‑delete).
 * @route  DELETE /api/v1/chat/session/:sessionId
 */
export const deleteSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  if (!sessionId) {
    throw new ApiError(400, "sessionId is required")
  }

  await ChatModel.findByIdAndUpdate(sessionId, { isDeleted: true });
  await MessageModel.updateMany({ sessionId }, { $set: { "isDeleted": true } }).catch(() => { });
  return res.status(200).json({ success: true, message: "Chat session deleted" });
});
