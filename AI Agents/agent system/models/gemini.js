import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";
dotenv.config();

export const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-3.5-flash-lite",
  maxOutputTokens: 2048,
  apiKey: process.env.GEMINI_API_KEY,
});
