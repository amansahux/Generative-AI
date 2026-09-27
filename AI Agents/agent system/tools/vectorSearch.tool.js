export const vectorSearchTool = tool(({ query }) => {
    return PineconeCompressionRetriever.invoke(query).then(docs => docs.map((d) => d.pageContent).join("\n\n"))
},
    {
        name: "vector_search",
        description: "Search for relevant documents in the vector database",
        schema: z.object({
            query: z.string().describe("The query to search for"),
        }),
    }
)