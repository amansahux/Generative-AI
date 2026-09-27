import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";
dotenv.config();

export const geminiModel = new ChatGoogleGenerativeAI({
  modelName: "gemini-1.5-pro",
  maxOutputTokens: 2048,
  apiKey: process.env.GEMINI_API_KEY,
});
