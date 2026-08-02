/**
 * @file src/ai/model.js
 * @description Provider-agnostic LLM initialization module for DevPilot AI.
 * Instantiates and exports individual model instances for Gemini, Groq, Cohere, 
 * Mistral, OpenRouter, Cerebras, and Nvidia, as well as a dynamic `getModel` factory function.
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatCohere } from "@langchain/cohere";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";

// Load environment variables dynamically based on module location
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

/**
 * Gemini model instance (Google Generative AI)
 */
export const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-3.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0.7,
});

/**
 * Cohere model instance
 */
export const cohereModel = new ChatCohere({
    model: "c4ai-aya-vision-32b",
    apiKey: process.env.COHERE_API_KEY,
    temperature: 0.7,
});

/**
 * Mistral AI model instance
 */
export const mistralModel = new ChatMistralAI({
    model: "ministral-8b-2512",
    apiKey: process.env.MISTRAL_API_KEY,
    temperature: 0.7,
});

/**
 * Groq model instance
 */
export const groqModel = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0.7,
});

/**
 * OpenRouter model instance (OpenAI-compatible)
 */
export const openRouterModel = new ChatOpenAI({
    model: "openai/gpt-4o-mini",
    apiKey: process.env.OPENROUTER_API_KEY,
    configuration: {
        baseURL: "https://openrouter.ai/api/v1",
    },
    temperature: 0.7,
});

/**
 * Cerebras model instance (OpenAI-compatible)
 */
export const cerebrasModel = new ChatOpenAI({
    model: "zai-glm-4.7",
    apiKey: process.env.CEREBRAS_API_KEY,
    configuration: {
        baseURL: "https://api.cerebras.ai/v1",
    },
    temperature: 0.7,
});

/**
 * NVIDIA NIM model instance (OpenAI-compatible)
 */
export const nvidiaModel = new ChatOpenAI({
    model: "meta/llama-3.1-70b-instruct",
    apiKey: process.env.NVIDIA_API_KEY,
    configuration: {
        baseURL: "https://integrate.api.nvidia.com/v1",
    },
    temperature: 0.7,
});

/**
 * Model provider map for fast lookup
 */
export const providerMap = {
    gemini: geminiModel,
    cohere: cohereModel,
    mistral: mistralModel,
    groq: groqModel,
    openrouter: openRouterModel,
    openai: openRouterModel,
    cerebras: cerebrasModel,
    nvidia: nvidiaModel,
};
