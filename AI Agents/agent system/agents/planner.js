import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { mistralModel } from "../models/mistral.js";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const tools = []; // Planners usually just think, they don't need external tools unless they search

const plannerAgent = createReactAgent({
  llm: mistralModel,
  tools,
  messageModifier: `You are a strategic planner agent.
Your task is to analyze complex requests and break them down into a step-by-step plan.
Do not execute the steps, just provide the clear and logical plan.`,
});

export const plannerAgentAsTool = tool(
  async ({ query }) => {
    const result = await plannerAgent.invoke({ messages: [{ role: "user", content: query }] });
    return result.messages[result.messages.length - 1].content;
  },
  {
    name: "planner_agent",
    description: "A strategic planning agent that breaks down complex user requests into manageable steps. Use this to plan.",
    schema: z.object({
      query: z.string().describe("The complex task to break down into a plan"),
    }),
  }
);
