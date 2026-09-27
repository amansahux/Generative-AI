const { SystemMessage } = require("@langchain/core/messages");
const { openRouterModel } = require("../models/openRouter");

/**
 * Writing Agent
 * Description: A creative and articulate writing agent responsible for drafting documents, documentation, summaries, and user-facing content based on technical details provided.
 */
const writingAgentPrompt = new SystemMessage(`You are a professional writing agent.
Your task is to create clear, engaging, and well-structured text.
Translate technical jargon into easily understandable language when writing for non-technical audiences.`);

async function runWritingAgent(input) {
  const response = await openRouterModel.invoke([writingAgentPrompt, { role: "user", content: input }]);
  return response.content;
}

module.exports = { runWritingAgent, writingAgentPrompt };
