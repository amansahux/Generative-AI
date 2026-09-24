import { createAgent } from "langchain";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { model } from "./model.js";
import { vectorSearchTool, WeatherTool, webSearchTool } from "./tool.js";
import * as readline from "node:readline/promises";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
    
const agent = createAgent({
    model: model,
    tools: [WeatherTool, vectorSearchTool, webSearchTool],
    instructions: `
    You are a helpful assistant.
    You have access to a weather tool and verctorSearchTool.
    Use the weather tool when the user asks
    for current weather information.
    Use the vectorSearchTool when the user asks
    for information from the documents.
    Do not use the tools for questions
    that don't require tool information.
    After receiving the tool result,
    provide a concise answer to the user.
  `,
});

const messages = [];

while (true) {
    const value = await rl.question(">>> ");

    if (value.toLowerCase() === "exit") {
        console.log("Goodbye!");
        rl.close();
        break;
    }

    messages.push(new HumanMessage(value));

    const res = await agent.invoke({
        messages: messages,
    });

    const aiContent = res.messages[res.messages.length - 1].content;
    messages.push(new AIMessage(aiContent));

    console.log(`\nAI: ${aiContent}\n`);
}
