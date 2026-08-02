import { createChatChain } from "../ai/chains/chat.chain.js";
import { mistralModel, openRouterModel } from "../ai/model.js";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

export const GenerateResponse = async (rawDbMessages) => {

    // // 1. Raw messages fetched from your database
    // const rawDbMessages = [
    //     {
    //         "_id": "6890d1301234567890abcdf0",
    //         "sessionId": "6890d1001234567890abcd11",
    //         "role": "user",
    //         "content": "Hi, myself Aman Sahu?"
    //     },
    //     {
    //         "_id": "6890d1311234567890abcdf1",
    //         "sessionId": "6890d1001234567890abcd11",
    //         "role": "assistant",
    //         "content": "I'm Amanova AI. How can I help you today?"
    //     },
    //     {
    //         "_id": "6890d1321234567890abcdf2",
    //         "sessionId": "6890d1001234567890abcd11",
    //         "role": "user",
    //         "content": "what is my name nd who is ur owner/creator"
    //     }
    // ];

    // 2. Extract the latest user query as the input
    const latestMessage = rawDbMessages[rawDbMessages.length - 1];
    const input = latestMessage.content;

    // 3. Map the previous turns (all messages except the last one) to LangChain message instances
    const history = rawDbMessages.slice(0, -1).map(msg => {
        if (msg.role === "user") {
            return new HumanMessage(msg.content);
        }
        // Maps "assistant" / "ai" to AIMessage
        return new AIMessage(msg.content);
    });

    // 4. Initialize and run the chain
    const chain = createChatChain(mistralModel);

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