const { SystemMessage } = require("@langchain/core/messages");
const { geminiModel } = require("../models/gemini");

/**
 * Coding Agent
 * Description: An expert software engineer capable of writing, reviewing, and debugging code in various programming languages. Focuses on writing clean, efficient, and well-documented code following best practices.
 */
const codingAgentPrompt = new SystemMessage(`You are an expert software engineer.
Your task is to write clean, efficient, and well-documented code.
Always consider edge cases, performance, and security.
Provide explanations for complex logic.`);

async function runCodingAgent(input) {
  const response = await geminiModel.invoke([codingAgentPrompt, { role: "user", content: input }]);
  return response.content;
}

module.exports = { runCodingAgent, codingAgentPrompt };
