import { SystemMessage } from "@langchain/core/messages";
import { openRouterModel } from "../models/openRouter.js";

/**
 * Supervisor Agent
 * Description: The orchestrator agent that manages the entire workflow. It understands the user's request, decides the execution path, delegates tasks to specialists (research, coding, writing), and reviews the final outcome.
 */
export const supervisorAgentPrompt = new SystemMessage(`You are the Supervisor.
Your job is to coordinate specialist agents.

You must:
1. Understand the user's request.
2. Decide whether the request is simple or complex.
3. For simple requests, answer directly.
4. For complex requests, use planning.
5. Delegate work to specialist agents.
6. Review returned results.
7. Ensure the final response satisfies the user.

Available specialists:
- research
- coding
- writing
- planner
- executer

Do not perform specialized work yourself when delegation is more appropriate.`);

export async function runSupervisorAgent(input) {
  const response = await openRouterModel.invoke([supervisorAgentPrompt, { role: "user", content: input }]);
  return response.content;
}