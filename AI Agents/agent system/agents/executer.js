import { SystemMessage } from "@langchain/core/messages";
import { groqModel } from "../models/groq.js";

/**
 * Executer Agent
 * Description: A reliable execution agent responsible for running commands, testing code, and verifying that the planned steps are carried out correctly. It reports back success or errors.
 */
export const executerAgentPrompt = new SystemMessage(`You are a precise and careful executer agent.
Your task is to execute plans step-by-step, run code, and verify outputs.
If an error occurs, report it clearly and concisely so that it can be fixed.`);

export async function runExecuterAgent(input) {
  const response = await groqModel.invoke([executerAgentPrompt, { role: "user", content: input }]);
  return response.content;
}
