/**
 * @file controllers/chat.controller.js
 * @description Placeholder chat controller functions.
 * Business logic (send message, list sessions, delete session, etc.) will be added here.
 */

/**
 * Create a new chat session.
 * @route  POST /api/chat/session
 */
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

/**
 * Create a new chat session.
 * @route  POST /api/chat/session
 */
export const createSession = async (req, res) => {
  try {
    const userId = req.user?.id || req.body?.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User identifier missing" });
    }

    const newSession = await ChatModel.create({ userId, title: "New Chat" });
    return res.status(201).json({ success: true, data: newSession });
  } catch (error) {
    console.error("createSession error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create session" });
  }
};

/**
 * Send a message and receive an AI response.
 * @route  POST /api/chat/message
 * Expected body: { sessionId: string, content: string }
 */
export const sendMessage = async (req, res) => {
  try {
    const { sessionId, content } = req.body;
    if (!sessionId || !content) {
      return res
        .status(400)
        .json({ success: false, message: "sessionId and content required" });
    }

    // Verify session existence (and not deleted)
    const session = await ChatModel.findOne({ _id: sessionId, isDeleted: false });
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Chat session not found" });
    }

    // Persist the user message
    await MessageModel.create({
      sessionId,
      role: "user",
      content,
    });

    // Load full conversation history (including the just‑saved user message)
    const rawAllMessages = await MessageModel.find({ sessionId })
      .sort({ createdAt: 1 })
      .lean();

    // Generate AI response through the LCEL chain
    const aiResponse = await GenerateResponse(rawAllMessages);

    // Persist AI message
    await MessageModel.create({
      sessionId,
      role: "ai",
      content: aiResponse,
    });

    // Optionally generate a concise session title (max 3 words)
    const title = await GenerateSession(content, aiResponse);
    if (title) {
      await ChatModel.findByIdAndUpdate(sessionId, { title });
    }

    return res.status(200).json({ success: true, data: aiResponse });
  } catch (error) {
    console.error("sendMessage error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to process message" });
  }
};

/**
 * Retrieve all chat sessions for the authenticated user.
 * @route  GET  /api/v1/chat/sessions
 */
export const getSessions = async (req, res) => {
  try {
    const userId = req.user?.id || req.query?.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User identifier missing" });
    }

    const sessions = await ChatModel.find({ userId, isDeleted: false })
      .sort({ updatedAt: -1 })
      .lean();
    return res.status(200).json({ success: true, data: sessions });
  } catch (error) {
    console.error("getSessions error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch sessions" });
  }
};

/**
 * Retrieve the message history of a specific chat session.
 * @route  GET  /api/v1/chat/session/:sessionId
 */
export const getSessionHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) {
      return res
        .status(400)
        .json({ success: false, message: "sessionId is required" });
    }

    const messages = await MessageModel.find({ sessionId })
      .sort({ createdAt: 1 })
      .lean();
    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error("getSessionHistory error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch history" });
  }
};

/**
 * Delete a specific chat session (soft‑delete).
 * @route  DELETE /api/v1/chat/session/:sessionId
 */
export const deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) {
      return res
        .status(400)
        .json({ success: false, message: "sessionId is required" });
    }

    await ChatModel.findByIdAndUpdate(sessionId, { isDeleted: true });
    // Optionally also hide related messages
    await MessageModel.updateMany({ sessionId }, { $set: { "isDeleted": true } }).catch(() => {});
    return res
      .status(200)
      .json({ success: true, message: "Chat session deleted" });
  } catch (error) {
    console.error("deleteSession error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete session" });
  }
};
