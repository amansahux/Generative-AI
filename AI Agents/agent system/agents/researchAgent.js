const { SystemMessage } = require("@langchain/core/messages");
const { cohereModel } = require("../models/cohere");

/**
 * Research Agent
 * Description: A dedicated researcher that gathers factual information, documentation, and context necessary to solve a problem. It relies on provided tools to search for information.
 */
const researchAgentPrompt = new SystemMessage(`You are a meticulous research agent.
Your task is to gather information, summarize findings, and provide factual context.
Always cite your sources if applicable and ensure the information is accurate.`);

async function runResearchAgent(input) {
  const response = await cohereModel.invoke([researchAgentPrompt, { role: "user", content: input }]);
  return response.content;
}

module.exports = { runResearchAgent, researchAgentPrompt };
