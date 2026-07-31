/**
 * @file controllers/auth.controller.js
 * @description Authentication controller for user registration, login, logout, and profile retrieval.
 */

import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import { ApiError, asyncHandler } from "../middleware/error.middleware.js";

/**
 * Register a new user with name, email, and password.
 * @route  POST /api/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    throw new ApiError(400, "Please provide name, email, and password.");
  }

  // Check if user already exists
  const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(400, "User already exists with this email.");
  }

  // Create user (password hashing handled automatically via userSchema.pre('save'))
  const user = await UserModel.create({
    name,
    email: email.toLowerCase(),
    password,
  });

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );

  // Set cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.status(201).json({
    success: true,
    message: "User registered successfully.",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        verified: user.verified,
      },
      token,
    },
  });
});

/**
 * Authenticate user using email and password, returning JWT and setting cookie.
 * @route  POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    throw new ApiError(400, "Please provide email and password.");
  }

  // Find user and select password field explicitly
  const user = await UserModel.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  if (!user || !user.password) {
    throw new ApiError(401, "Invalid credentials.");
  }

  // Compare passwords using schema method
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials.");
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );

  // Set cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "Logged in successfully.",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        verified: user.verified,
      },
      token,
    },
  });
});

/**
 * Log out user by clearing the auth cookie.
 * @route  POST /api/auth/logout
 */
export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});

/**
 * Return profile of currently authenticated user.
 * @route  GET /api/auth/me
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user.id);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        googleId: user.googleId,
        verified: user.verified,
        createdAt: user.createdAt,
      },
    },
  });
});
