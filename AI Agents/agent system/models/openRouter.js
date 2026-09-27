import { ChatOpenRouter } from "@langchain/openrouter";
import dotenv from "dotenv";
dotenv.config();

export const openRouterModel = new ChatOpenRouter({
    openAIApiKey: process.env.OPENROUTER_API_KEY,
    model: "laguna-s-2.1",
    configuration: {
        baseURL: "https://openrouter.ai/api/v1",
    },
});
