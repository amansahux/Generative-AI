import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { groqModel } from "../models/groq.js";
import { codeTool } from "../tools/codeTool.js";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const tools = [codeTool];

const executerAgent = createReactAgent({
  llm: groqModel,
  tools,
  messageModifier: `You are a precise and careful executer agent.
Your task is to execute plans step-by-step, run code, and verify outputs using your tools.
If an error occurs, report it clearly and concisely so that it can be fixed.`,
});

export const executerAgentAsTool = tool(
  async ({ query }) => {
    const result = await executerAgent.invoke({ messages: [{ role: "user", content: query }] });
    return result.messages[result.messages.length - 1].content;
  },
  {
    name: "executer_agent",
    description: "A reliable execution agent responsible for running commands and testing code. Use this to verify or run things.",
    schema: z.object({
      query: z.string().describe("The task or commands to execute"),
    }),
  }
);
