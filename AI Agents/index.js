import { createAgent } from "langchain";
import { HumanMessage } from "@langchain/core/messages";
import { model } from "./model.js";
import { vectorSearchTool, WeatherTool } from "./tool.js";

const agent = createAgent({
    model: model,
    tools: [WeatherTool, vectorSearchTool],
});

const res = await agent.invoke({
    messages: [new HumanMessage("How long the arav's internship?")],
});

// console.log(res);
console.log("===============================================================================================================");
const lastMessage = res.messages[res.messages.length - 1];
console.log(lastMessage?.content);
