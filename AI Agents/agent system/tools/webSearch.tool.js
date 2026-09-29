import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { tavily } from "@tavily/core";
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export const webSearchTool = tool(async ({ query, deep_search }) => {
    console.log("web search tool executed")
    const res = await tvly.search(query, {
        max_results: 5,
        deep_search: deep_search || false,
    });
    return JSON.stringify(res)
},
    {
        name: "web_search",
        description: "Search the web for latest or recent information",
        schema: z.object({
            query: z.string().describe("The query to search for"),
            deep_search: z.boolean().describe("Use true if the query needs deep search.")
        }),
    }
)