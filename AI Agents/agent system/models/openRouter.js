import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
dotenv.config();

export const openRouterModel = new ChatOpenAI({
    openAIApiKey: process.env.OPENROUTER_API_KEY,
    model: "openai/gpt-3.5-turbo",
    configuration: {
        baseURL: "https://openrouter.ai/api/v1",
    },
});
