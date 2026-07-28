import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-flash-latest",
  apiKey: process.env.GEMINI_API_KEY,
});



// const model2 = new ChatAnthropic({
// model:"claude-sonnet-4",
// apiKey:process.env.ANTHROPIC_API_KEY
// });



// const model3 = new ChatOpenAI({
// model:"gpt-4.1",
// apiKey:process.env.OPENAI_API_KEY

// });

// const response = await model.invoke("Who are you?");
// console.log(response)

const response = await model.invoke([
  new SystemMessage("You are a Java teacher."),
  new HumanMessage("Explain OOP."),
]);

console.log(response.content);