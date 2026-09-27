import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { PineconeCompressionRetriever } from "../../../Rag/index.js";


export const vectorSearchTool = tool(
    async ({ query }) => {
        return PineconeCompressionRetriever?.invoke(query).then(docs => docs.map((d) => d.pageContent).join("\n\n"));
    },
    {
        name: "vector_search",
        description: "Search for relevant documents in the vector database",
        schema: z.object({
            query: z.string().describe("The query to search for"),
        }),
    }
);