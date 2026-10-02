
import dotenv from "dotenv";
dotenv.config();
import { ChatCohere } from "@langchain/cohere";
import { ChatOpenRouter } from "@langchain/openrouter";
import { ChatGroq } from "@langchain/groq";


export const cohereModel = new ChatCohere({
    model: "command-a-03-2025",
    apiKey: process.env.COHERE_API_KEY,
});
export const groqModel = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "openai/gpt-oss-20b",

});
export const openRouterModel = new ChatOpenRouter({
    openAIApiKey: process.env.OPENROUTER_API_KEY,
    model: "laguna-s-2.1",
    configuration: {
        baseURL: "https://openrouter.ai/api/v1",
    },
});

