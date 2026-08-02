/**
 * @file ai/runnable/formatter.js
 * @description Placeholder for a runnable output formatter.
 * Transforms raw AI responses into the shape expected by downstream handlers.
 */

/**
 * Format an AI output object into a standardised response shape.
 *
 * @param {*} output - Raw output from the AI chain.
 * @returns {Object} Formatted response (placeholder — returns empty object).
 */
export const formatOutput = (output) => {
  if (!output) return "";
  
  // If the output is an object (e.g. from structured responses or message objects), extract content
  let text = typeof output === "string" ? output : (output.content || output.text || "");
  
  if (typeof text !== "string") {
    text = JSON.stringify(text);
  }

  // Normalize line endings and trim surrounding whitespaces
  return text.replace(/\r\n/g, "\n").trim();
};
