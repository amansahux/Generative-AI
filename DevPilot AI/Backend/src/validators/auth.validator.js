/**
 * @file validators/auth.validator.js
 * @description Authentication input validation schemas using Zod and validation middleware.
 */

import { z } from "zod";
import { ApiError } from "../middleware/error.middleware.js";

/**
 * Zod schema for user registration.
 */
export const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .min(2, "Name must be at least 2 characters long.")
    .trim(),
  email: z
    .string({ required_error: "Email is required." })
    .email("Invalid email address format.")
    .trim()
    .toLowerCase(),
  password: z
    .string({ required_error: "Password is required." })
    .min(6, "Password must be at least 6 characters long."),
});

/**
 * Zod schema for user login.
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email("Invalid email address format.")
    .trim()
    .toLowerCase(),
  password: z
    .string({ required_error: "Password is required." })
    .min(1, "Password is required."),
});

/**
 * Express middleware generator to validate request body against a Zod schema.
 *
 * @param {import('zod').ZodSchema} schema
 * @returns {import('express').RequestHandler}
 */
export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // Extract the first error message or join all issue messages
    const errorMessage = result.error.errors
      .map((err) => err.message)
      .join(", ");
    return next(new ApiError(400, errorMessage));
  }

  // Replace req.body with sanitized and validated data
  req.body = result.data;
  next();
};