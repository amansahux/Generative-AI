import { createAgent } from "langchain";
import { HumanMessage } from "@langchain/core/messages";
import { model } from "./model.js";
import { WeatherTool } from "./tool.js";

const agent = createAgent({
    model: model,
    tools: [WeatherTool],
});

const res = await agent.invoke({
    messages: [new HumanMessage("What is the weather in Ranchi?")],
});

console.log(res);
console.log("===============================================================================================================");
const lastMessage = res.messages[res.messages.length - 1];
console.log(lastMessage?.content);