import { tool } from "@langchain/core/tools";
import { z } from "zod";

// Mocking tvly
const tvly = {
    search: async (query, opts) => {
        return { results: [{ url: "https://example.com", content: "Result for " + query }] };
    }
};

export const webSearchTool = tool(
    async ({ query, deep_search }) => {
        const res = await tvly.search(query, {
            max_results: 5,
            deep_search: deep_search || false,
        });
        return JSON.stringify(res);
    },
    {
        name: "web_search",
        description: "Search the web for latest or recent information",
        schema: z.object({
            query: z.string().describe("The query to search for"),
            deep_search: z.boolean().describe("Use true if the query needs deep search.").optional()
        }),
    }
);