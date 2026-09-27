import { ChatOpenRouter } from "@langchain/openrouter";
import dotenv from "dotenv";
dotenv.config();

export const openRouterModel = new ChatOpenRouter({
    openAIApiKey: process.env.OPENROUTER_API_KEY,
    model: "anthropic/claude-sonnet-4.5",
    configuration: {
        baseURL: "https://openrouter.ai/api/v1",
    },
});
