import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";
dotenv.config();

export const groqModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-20b",
  
});
