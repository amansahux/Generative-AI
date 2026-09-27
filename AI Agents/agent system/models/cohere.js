import { ChatCohere } from "@langchain/cohere";
import dotenv from "dotenv";
dotenv.config();

export const cohereModel = new ChatCohere({
  apiKey: process.env.COHERE_API_KEY,
  model: "command-r-plus",
});
