/**
 * @file models/user.model.js
 * @description Mongoose schema and model for a User.
 * Supports traditional email/password authentication as well as Google OAuth.
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Middleware / Pre-hooks ───────────────────────────────────────────────────

/**
 * Pre-save middleware to hash password before saving to DB.
 */
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) {
    return 
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw new Error(error)
  }
});

// ─── Instance Methods ─────────────────────────────────────────────────────────

/**
 * Method to compare candidate password with stored hashed password.
 * @param {string} candidatePassword
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model("users", userSchema);

export default UserModel;