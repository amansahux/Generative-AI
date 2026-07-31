/**
 * @file server.js
 * @description Entry point — loads environment variables, connects to MongoDB, and starts the HTTP server.
 */

import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  // Connect to MongoDB before accepting any traffic
  await connectDB();

  app.listen(PORT, () => {
    console.log(`✅  DevPilot AI server running on http://localhost:${PORT}`);
    console.log(`📡  Environment : ${process.env.NODE_ENV || "development"}`);
  });
};

startServer();
