/**
 * @file src/ai/prompts/title.prompt.js
 * @description Conversation title generation prompt template for DevPilot AI.
 * Instructs the AI to summarize a Q&A exchange into a short title of at most 3 words.
 */

import { ChatPromptTemplate } from "@langchain/core/prompts";

/**
 * Title prompt template.
 *
 * @type {ChatPromptTemplate}
 */
export const titlePrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are DevPilot AI's utility module for generating session titles.
Analyze the user's initial prompt and the AI's response, then generate an extremely concise chat title.

Rules:
1. The title must be at most 3 words.
2. Output ONLY the raw title string.
3. Do NOT include punctuation, quotation marks, introductory text, prefixes, or markdown formatting (e.g., do not write "Title: ...").`
  ],
  [
    "human",
    `Prompt: "{prompt}"
Response: "{response}"`
  ]
]);
