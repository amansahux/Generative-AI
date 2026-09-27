import { createAgent } from "langchain";
import { cohereModel } from "../models/cohere.js";
import { vectorSearchTool } from "../tools/vectorSearch.tool.js";
import { webSearchTool } from "../tools/webSearch.tool.js";
import { WeatherTool } from "../tools/weatherTool.js";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const researchAgent = createAgent({
  model: cohereModel,
  tools: [vectorSearchTool, webSearchTool, WeatherTool],
  instructions: `You are a meticulous research agent.
Your task is to gather information, summarize findings, and provide factual context.
Use your search, weather, and vector search tools to gather information.
Always cite your sources if applicable and ensure the information is accurate.`,
});

export const researchAgentAsTool = tool(
  async ({ query }) => {
    const result = await researchAgent.invoke({ input: query });
    return JSON.stringify(result);
  },
  {
    name: "research_agent",
    description: "A dedicated researcher that gathers factual information via web search and vector search.",
    schema: z.object({
      query: z.string().describe("The topic or question to research"),
    }),
  }
);
