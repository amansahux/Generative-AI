/**
 * @file routes/chat.routes.js
 * @description Chat route definitions — maps HTTP endpoints to controller functions.
 * All chat routes are protected and require a valid JWT.
 */

import { Router } from "express";
import {
  sendMessage,
  getSessions,
  getSessionHistory,
  deleteSession,
} from "../controllers/chat.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

// Apply auth middleware to every chat route
router.use(verifyToken);

// ─── Session Routes ───────────────────────────────────────────────────────────

/** Get all chat sessions for the current user */
router.get("/sessions", getSessions);

/** Get message history for a specific session */
router.get("/session/:sessionId", getSessionHistory);

/** Delete a specific chat session */
router.delete("/session/:sessionId", deleteSession);

// ─── Message Routes ───────────────────────────────────────────────────────────

/** Send a message and receive an AI response */
router.post("/message", sendMessage);

export default router;
