import { createAgent } from "langchain";
import { createChatChain } from "../ai/chains/chat.chain.js";
import { geminiModel, mistralModel, openRouterModel } from "../ai/model.js";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { weatherTool } from "../ai/tools/weather.tool.js";
import { readmeTool } from "../ai/tools/readme.tool.js";
import { snippetTool } from "../ai/tools/snippet.tool.js";
import { timeTool } from "../ai/tools/time.tool.js";
import { todoTool } from "../ai/tools/todo.tool.js";
const agent = createAgent({
    model:geminiModel,
    tools:[weatherTool , readmeTool , snippetTool, timeTool, todoTool]
})
const chain = createChatChain(mistralModel);

export const GenerateResponse = async (rawDbMessages) => {

    // 1. Extract the latest user query as the input
    const latestMessage = rawDbMessages[rawDbMessages.length - 1];
    const input = latestMessage.content;

    // 2. Map the previous turns (all messages except the last one) to LangChain message instances
    const history = rawDbMessages.slice(0, -1).map(msg => {
        if (msg.role === "user") {
            return new HumanMessage(msg.content);
        }
        // Maps "assistant" / "ai" to AIMessage
        return new AIMessage(msg.content);
    });

    const res = await chain.invoke({
        history,
        input,
    });

    return res;
}

export const GenerateSession = async (prompt, response) => {
    try {
        const titleResponse = await openRouterModel.invoke([
            ["system", "You generate extremely concise titles. Generate a chat session title of at most 3 words summarizing the following Q&A. Output ONLY the raw title without punctuation, quotes, introduction, or prefix."],
            ["human", `Prompt: "${prompt}"\nResponse: "${response}"`]
        ]);

        // Clean any quotes and trim
        return titleResponse.content.trim().replace(/^["']|["']$/g, "");
    } catch (error) {
        console.error("Error generating session title:", error);
        return prompt.split(/\s+/).slice(0, 3).join(" ") || "New Chat";
    }
}