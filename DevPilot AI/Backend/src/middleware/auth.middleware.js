/**
 * @file middleware/auth.middleware.js
 * @description JWT verification middleware.
 * Reads the token from the Authorization header (Bearer) or from a signed cookie,
 * verifies it, and attaches the decoded payload to req.user.
 */

import jwt from "jsonwebtoken";

/**
 * Express middleware that protects routes by validating a JWT.
 *
 * Token lookup order:
 *  1. Authorization header  →  "Bearer <token>"
 *  2. Signed cookie         →  token
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const verifyToken = async (req, res, next) => {
  try {
    // 1. Extract token from header or cookie
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // 2. Verify the token using the secret from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // 3. Attach decoded payload to request for downstream handlers
    req.user = decoded;

    next();
  } catch (error) {
    // Handle token expiry and invalid signature separately
    const message =
      error.name === "TokenExpiredError"
        ? "Token has expired."
        : "Invalid token.";

    return res.status(401).json({ success: false, message });
  }
};
