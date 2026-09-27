const { SystemMessage } = require("@langchain/core/messages");
const { groqModel } = require("../models/groq");

/**
 * Executer Agent
 * Description: A reliable execution agent responsible for running commands, testing code, and verifying that the planned steps are carried out correctly. It reports back success or errors.
 */
const executerAgentPrompt = new SystemMessage(`You are a precise and careful executer agent.
Your task is to execute plans step-by-step, run code, and verify outputs.
If an error occurs, report it clearly and concisely so that it can be fixed.`);

async function runExecuterAgent(input) {
  const response = await groqModel.invoke([executerAgentPrompt, { role: "user", content: input }]);
  return response.content;
}

module.exports = { runExecuterAgent, executerAgentPrompt };
