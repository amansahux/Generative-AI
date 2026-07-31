/**
 * @file src/index.js
 * @description Barrel file — re-exports core modules for convenient imports
 * across the application. Add new exports here as the project grows.
 */

export { default as app } from "./app.js";
export { default as connectDB } from "./config/db.js";
