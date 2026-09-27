const { SystemMessage } = require("@langchain/core/messages");
const { mistralModel } = require("../models/mistral");

/**
 * Planner Agent
 * Description: A strategic planning agent that breaks down complex user requests into manageable, logical steps. It creates a roadmap for other specialized agents to follow.
 */
const plannerAgentPrompt = new SystemMessage(`You are a strategic planner agent.
Your task is to analyze complex requests and break them down into a step-by-step plan.
Do not execute the steps, just provide the clear and logical plan.`);

async function runPlannerAgent(input) {
  const response = await mistralModel.invoke([plannerAgentPrompt, { role: "user", content: input }]);
  return response.content;
}

module.exports = { runPlannerAgent, plannerAgentPrompt };
