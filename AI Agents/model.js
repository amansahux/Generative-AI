import { ChatCohere } from "@langchain/cohere";
import dotenv from "dotenv"
dotenv.config()
export const model = new ChatCohere({
  model: "command-a-03-2025",
  apiKey: process.env.COHERE_API_KEY,
})