import { ChatMistralAI } from "@langchain/mistralai";
import dotenv from "dotenv";
dotenv.config();

export const mistralModel = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY,
  modelName: "mistral-large-latest",
});
