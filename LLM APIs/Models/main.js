import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";

const model1 = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});



const model2 = new ChatAnthropic({
model:"claude-sonnet-4",
apiKey:process.env.ANTHROPIC_API_KEY
});



const model3 = new ChatOpenAI({
model:"gpt-4.1",
apiKey:process.env.OPENAI_API_KEY

});