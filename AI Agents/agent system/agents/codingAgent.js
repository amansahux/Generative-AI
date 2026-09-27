import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { geminiModel } from "../models/gemini.js";
import { codeTool } from "../tools/codeTool.js";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const tools = [codeTool];

const codingAgent = createReactAgent({
  llm: geminiModel,
  tools,
  messageModifier: `You are an expert software engineer.
Your task is to write clean, efficient, and well-documented code.
Always consider edge cases, performance, and security.
Provide explanations for complex logic. Use the code tool to execute and test code if necessary.`,
});

export const codingAgentAsTool = tool(
  async ({ query }) => {
    const result = await codingAgent.invoke({ messages: [{ role: "user", content: query }] });
    return result.messages[result.messages.length - 1].content;
  },
  {
    name: "coding_agent",
    description: "An expert software engineer capable of writing, reviewing, and debugging code. Pass coding tasks here.",
    schema: z.object({
      query: z.string().describe("The coding task or question"),
    }),
  }
);
