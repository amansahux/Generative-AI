/**
 * @file config/db.js
 * @description Reusable MongoDB connection function using Mongoose.
 */

import mongoose from "mongoose";

/**
 * Connects to MongoDB using the MONGO_URI environment variable.
 * Exits the process with code 1 if the connection fails.
 *
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🗄️   MongoDB connected : ${connection.connection.host}`);
  } catch (error) {
    console.error("❌  MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
