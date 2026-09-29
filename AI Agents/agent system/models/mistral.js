import { ChatMistralAI } from "@langchain/mistralai";
import dotenv from "dotenv";
dotenv.config();

export const mistralModel = new ChatMistralAI({

  model: "mistral-small-2603",
  apiKey: process.env.MISTRAL_API_KEY,
});
