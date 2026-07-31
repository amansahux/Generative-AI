/**
 * @file utils/tokenCounter.js
 * @description Placeholder utility for counting tokens in a text string.
 * Useful for enforcing model context-window limits.
 */

/**
 * Count the approximate number of tokens in a text string.
 * (Uses a rough heuristic until a real tokenizer is wired in.)
 *
 * @param {string} text - The input text to count tokens for.
 * @returns {number} Approximate token count.
 */
export const countTokens = (text) => {
  if (!text || typeof text !== "string") return 0;

  // Rough approximation: 1 token ≈ 4 characters (OpenAI heuristic)
  return Math.ceil(text.length / 4);
};

/**
 * Check whether a text string exceeds a given token limit.
 *
 * @param {string} text - The input text.
 * @param {number} limit - Maximum allowed token count.
 * @returns {boolean} True if the text exceeds the limit.
 */
export const exceedsTokenLimit = (text, limit) => {
  return countTokens(text) > limit;
};
