/**
 * @file ai/runnable/logger.js
 * @description Placeholder for a runnable AI request/response logger.
 * Logs input prompts and AI outputs for debugging and audit purposes.
 */

/**
 * Log an AI chain invocation (input + output).
 *
 * @param {Object} params
 * @param {string} params.sessionId - The associated chat session ID.
 * @param {string} params.input     - The prompt sent to the AI.
 * @param {string} params.output    - The AI's response.
 * @returns {void}
 */
export const logInvocation = ({ sessionId = "anonymous", input = "", output = "" }) => {
  const timestamp = new Date().toISOString();
  
  // Format log statement professionally
  if (process.env.NODE_ENV !== "production") {
    console.log(`[${timestamp}] [AI Logger] Session: ${sessionId}`);
    console.log(`  Input  : ${String(input).replace(/\n/g, " ").slice(0, 150)}...`);
    console.log(`  Output : ${String(output).replace(/\n/g, " ").slice(0, 150)}...`);
  }
};
