/**
 * @file routes/auth.routes.js
 * @description Auth route definitions — maps HTTP endpoints to controller functions.
 */

import { Router } from "express";
import {
  register,
  login,
  logout,
  getProfile,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

// ─── Public Routes ────────────────────────────────────────────────────────────

/** Register a new user account */
router.post("/register", register);

/** Authenticate and receive a JWT */
router.post("/login", login);

// ─── Protected Routes ─────────────────────────────────────────────────────────

/** Terminate the current session (auth required) */
router.post("/logout", verifyToken, logout);

/** Return the authenticated user's profile (auth required) */
router.get("/me", verifyToken, getProfile);

export default router;
