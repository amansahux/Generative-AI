import "dotenv/config";
import readline from "readline/promises";
import { ChatMistralAI } from "@langchain/mistralai";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const model = new ChatMistralAI({
  model: "mistral-small-latest",
  temperature: 0,
});

const messages = []

while (true) {
  const userInput = await rl.question("\x1b[32mYou:\x1b[0m ");
  messages.push("user: " , userInput)

  const res = await model.invoke(messages , "under 5 line ");
  messages.push("AI: " , res.text)
  console.log("AI: ", res.text);
}

rl.close();
