/**
 * @file ai/prompts/explain.prompt.js
 * @description Placeholder for the code-explanation prompt template.
 * This prompt instructs the AI to explain a given code snippet in plain language.
 */

/**
 * Explain prompt template string.
 * The {code} placeholder will be replaced at runtime with the actual snippet.
 *
 * @type {string}
 */
export const explainPrompt = `
You are a senior developer. Explain the following code snippet clearly and concisely
to a developer who may not be familiar with this part of the codebase.

Code:
{code}

Explanation:
`.trim();
