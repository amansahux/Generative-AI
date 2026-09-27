import { createAgent } from "langchain";
import { groqModel } from "../models/groq.js";
import { codeTool } from "../tools/codeTool.js";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { HumanMessage } from "@langchain/core/messages";
import { handoffToSupervisor } from "../workflow/handoff.js";

export const executerAgent = createAgent({
  model: groqModel,
  tools: [codeTool, handoffToSupervisor],
  instructions: `You are a precise and careful executer agent.
Your task is to execute plans step-by-step, run code, and verify outputs using your tools.
If an error occurs, report it clearly and concisely so that it can be fixed.`,
});

export const executerAgentAsTool = tool(
  async ({ query }) => {
    const result = await executerAgent.invoke({ messages: [new HumanMessage(query)] });
    const lastMsg = result?.messages?.[result.messages.length - 1];
    return lastMsg?.content || JSON.stringify(result);
  },
  {
    name: "executer_agent",
    description: "A reliable execution agent responsible for running commands and testing code. Use this to verify or run things.",
    schema: z.object({
      query: z.string().describe("The task or commands to execute"),
    }),
  }
);
