import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatCohere } from "@langchain/cohere";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });


/**
 * Gemini model instance using GEMINI_API_KEY from environment variables.
 */
export const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-flash-latest",
    apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Cohere model instance using COHERE_API_KEY from environment variables.
 */
export const cohereModel = new ChatCohere({
    model: "command-a-vision-07-2025",
    apiKey: process.env.COHERE_API_KEY,
});

/**
 * Mistral model instance using MISTRAL_API_KEY from environment variables.
 */
export const mistralModel = new ChatMistralAI({
    model: "mistral-large-latest",
    apiKey: process.env.MISTRAL_API_KEY,
});

/**
 * Groq model instance using GROQ_API_KEY from environment variables.
 */
export const groqModel = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    apiKey: process.env.GROQ_API_KEY,
});

/**
 * OpenRouter model instance using OPENROUTER_API_KEY from environment variables.
 */
export const openRouterModel = new ChatOpenAI({
    model: "openai/gpt-4o-mini",
    apiKey: process.env.OPENROUTER_API_KEY,
    configuration: {
        baseURL: "https://openrouter.ai/api/v1",
    },
});

/**
 * Cerebras model instance using CEREBRAS_API_KEY from environment variables.
 */
export const cerebrasModel = new ChatOpenAI({
    model: "zai-glm-4.7",
    apiKey: process.env.CEREBRAS_API_KEY,
    configuration: {
        baseURL: "https://api.cerebras.ai/v1",
    },
});

/**
 * Nvidia model instance using NVIDIA_API_KEY from environment variables.
 */
export const nvidiaModel = new ChatOpenAI({
    model: "meta/llama-3.1-70b-instruct",
    apiKey: process.env.NVIDIA_API_KEY,
    configuration: {
        baseURL: "https://integrate.api.nvidia.com/v1",
    },
});

// Default exported model object containing all model instances
export const model = {
    geminiModel,
    cohereModel,
    mistralModel,
    groqModel,
    openRouterModel,
    cerebrasModel,
    nvidiaModel,
};
