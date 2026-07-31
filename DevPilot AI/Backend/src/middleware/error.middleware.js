/**
 * @file middleware/error.middleware.js
 * @description Global Error Handling Middleware & Custom Error Class.
 */

/**
 * Custom Error Class for operational/HTTP errors.
 */
export class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error description
   */
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Higher-order wrapper function (asyncHandler) to eliminate try/catch blocks in controllers.
 * Passes any caught error directly to Express next(err).
 *
 * @param {Function} fn - Async controller function
 * @returns {Function} Express middleware function
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Express Global Error Handling Middleware.
 *
 * @param {Error|ApiError} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
