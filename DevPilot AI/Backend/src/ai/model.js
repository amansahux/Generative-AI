import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatCohere } from "@langchain/cohere";

/**
 * Gemini model instance using GEMINI_API_KEY from environment variables.
 */
export const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Cohere model instance using COHERE_API_KEY from environment variables.
 */
export const cohereModel = new ChatCohere({
  model: "command-r-plus",
  apiKey: process.env.COHERE_API_KEY,
});

// Default exported model alias for convenience
export const model = {geminiModel , cohereModel};

