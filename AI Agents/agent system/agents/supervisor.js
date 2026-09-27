import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { openRouterModel } from "../models/openRouter.js";
import { codingAgentAsTool } from "./codingAgent.js";
import { executerAgentAsTool } from "./executer.js";
import { plannerAgentAsTool } from "./planner.js";
import { researchAgentAsTool } from "./researchAgent.js";
import { writingAgentAsTool } from "./writingAgent.js";

const tools = [
  codingAgentAsTool,
  executerAgentAsTool,
  plannerAgentAsTool,
  researchAgentAsTool,
  writingAgentAsTool
];

export const supervisorAgent = createReactAgent({
  llm: openRouterModel,
  tools,
  messageModifier: `You are the Supervisor, the orchestrator agent that manages the entire workflow.
Your job is to coordinate specialist agents.

You must:
1. Understand the user's request.
2. Decide whether the request is simple or complex.
3. For simple requests, answer directly.
4. For complex requests, use the planner agent to create a plan.
5. Delegate work to specialist agents (research, coding, writing, executer) using your tools.
6. Review returned results.
7. Ensure the final response satisfies the user.

Do not perform specialized work yourself when delegation is more appropriate.`,
});

export async function runSupervisor(input) {
  const result = await supervisorAgent.invoke({ messages: [{ role: "user", content: input }] });
  return result.messages[result.messages.length - 1].content;
}