/**
 * @file models/user.model.js
 * @description Mongoose schema and model for a User.
 * Supports traditional email/password authentication as well as Google OAuth.
 */

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    /** Full name of the user */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    /** Unique email address */
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    /** Hashed password (optional if user signs in via Google OAuth) */
    password: {
      type: String,
      select: false,
    },

    /** Google OAuth ID */
    googleId: {
      type: String,
      default: null,
    },

    /** Verification status (email/account verified) */
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("users", userSchema);

export default UserModel;