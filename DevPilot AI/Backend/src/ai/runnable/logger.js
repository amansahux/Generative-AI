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
export const logInvocation = ({ sessionId, input, output }) => {
  // TODO: Route to a structured logger (e.g. Winston, Pino) or external service
  if (process.env.NODE_ENV === "development") {
    console.log(`[AI Logger] Session: ${sessionId}`);
    console.log(`  Input  : ${String(input).slice(0, 120)}...`);
    console.log(`  Output : ${String(output).slice(0, 120)}...`);
  }
};
