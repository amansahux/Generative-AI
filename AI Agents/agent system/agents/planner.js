import { createAgent } from "langchain";
import { mistralModel } from "../models/mistral.js";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { handoffToSupervisor } from "../workflow/handoff.js";

export const plannerAgent = createAgent({
  model: mistralModel,
  tools: [handoffToSupervisor],
  instructions: `You are a strategic planner agent.
Your task is to analyze complex requests and break them down into a step-by-step plan.
Do not execute the steps, just provide the clear and logical plan.`,
});

export const plannerAgentAsTool = tool(
  async ({ query }) => {
    const result = await plannerAgent.invoke({ input: query });
    return JSON.stringify(result);
  },
  {
    name: "planner_agent",
    description: "A strategic planning agent that breaks down complex user requests into manageable steps. Use this to plan.",
    schema: z.object({
      query: z.string().describe("The complex task to break down into a plan"),
    }),
  }
);
