import { createAgent } from "langchain";
import { HumanMessage } from "@langchain/core/messages";
import { model } from "./model.js";
import { vectorSearchTool, WeatherTool } from "./tool.js";

const agent = createAgent({
    model: model,
    tools: [WeatherTool, vectorSearchTool],
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

const res = await agent.invoke({
    messages: [new HumanMessage("What is the weather in karachi?")],
});

// console.log(res);
console.log("===============================================================================================================");
const lastMessage = res.messages[res.messages.length - 1];  
console.log(lastMessage?.content);
