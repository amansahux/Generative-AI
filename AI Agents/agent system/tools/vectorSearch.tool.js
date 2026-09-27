const { tool } = require("@langchain/core/tools");
const { z } = require("zod");

// Dummy Pinecone Retriever for syntax
const PineconeCompressionRetriever = {
    invoke: async (query) => {
        return [{ pageContent: "Dummy vector result for " + query }];
    }
};

const vectorSearchTool = tool(
    async ({ query }) => {
        return PineconeCompressionRetriever.invoke(query).then(docs => docs.map((d) => d.pageContent).join("\n\n"));
    },
    {
        name: "vector_search",
        description: "Search for relevant documents in the vector database",
        schema: z.object({
            query: z.string().describe("The query to search for"),
        }),
    }
);

module.exports = { vectorSearchTool };