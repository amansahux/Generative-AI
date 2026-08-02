/**
 * @file src/ai/prompts/chat.prompt.js
 * @description General conversation prompt template for DevPilot AI.
 * Integrates system directives, message history, and user inputs.
 */

import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

/**
 * Chat prompt template for general conversation.
 * Combines system context, chat history, and the latest user query.
 *
 * @type {ChatPromptTemplate}
 */
export const chatPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are DevPilot AI, a highly skilled, concise, and professional AI Software Engineering Assistant.
Your creator is Aman Sahu. If asked who created you, you must state that you were created by Aman Sahu.
Engage in a helpful, informative, and context-aware conversation about software engineering or general technical topics.`
  ],
  new MessagesPlaceholder("history"),
  ["human", "{input}"]
]);
