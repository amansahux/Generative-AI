/**
 * @file app.js
 * @description Express application setup — middleware, CORS, routes, and global error handling.
 */

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";

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

/** Authentication routes — /api/v1/auth */
app.use("/api/auth", authRoutes);

/** Chat routes — /api/v1/chat */
app.use("/api/chat", chatRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "devpilot-ai" });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────

/**
 * Centralized error handler — catches errors forwarded via next(err).
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;
