import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { cohereModel } from "../models/cohere.js";
import { vectorSearchTool } from "../tools/vectorSearch.tool.js";
import { webSearchTool } from "../tools/webSearch.tool.js";
import { weatherTool } from "../tools/weatherTool.js";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const tools = [vectorSearchTool, webSearchTool, weatherTool];

const researchAgent = createReactAgent({
  llm: cohereModel,
  tools,
  messageModifier: `You are a meticulous research agent.
Your task is to gather information, summarize findings, and provide factual context.
Use your search, weather, and vector search tools to gather information.
Always cite your sources if applicable and ensure the information is accurate.`,
});

export const researchAgentAsTool = tool(
  async ({ query }) => {
    const result = await researchAgent.invoke({ messages: [{ role: "user", content: query }] });
    return result.messages[result.messages.length - 1].content;
  },
  {
    name: "research_agent",
    description: "A dedicated researcher that gathers factual information via web search and vector search.",
    schema: z.object({
      query: z.string().describe("The topic or question to research"),
    }),
  }
);
