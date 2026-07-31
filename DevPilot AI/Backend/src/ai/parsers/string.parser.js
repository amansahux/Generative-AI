/**
 * @file ai/parsers/string.parser.js
 * @description Placeholder for a string output parser.
 * Trims, sanitizes, and normalises the AI's raw string output.
 */

/**
 * Parse and clean a raw AI string response.
 *
 * @param {string} rawResponse - The raw text output from the AI.
 * @returns {string} Cleaned and trimmed string.
 */
export const parseStringResponse = (rawResponse) => {
  if (!rawResponse || typeof rawResponse !== "string") return "";

  // TODO: Add further sanitization (strip unsafe HTML, normalize whitespace, etc.)
  return rawResponse.trim();
};
