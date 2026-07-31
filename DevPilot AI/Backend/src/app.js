/**
 * @file app.js
 * @description Express application setup — middleware, CORS, routes, and global error handling.
 */

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────

/** Parse incoming JSON payloads */
app.use(express.json());

/** Parse URL-encoded form data */
app.use(express.urlencoded({ extended: true }));

/** Enable Cross-Origin Resource Sharing */
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "*",
  credentials: true,
}));

/** Parse Cookie headers */
app.use(cookieParser());

// ─── Routes ───────────────────────────────────────────────────────────────────

/** Authentication routes — /api/auth */
app.use("/api/auth", authRoutes);

/** Chat routes — /api/chat */
app.use("/api/chat", chatRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "devpilot-ai" });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────

app.use(errorHandler);

export default app;
