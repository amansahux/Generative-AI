// import { createAgent } from "langchain";
// import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { model } from "./model.js";
import { vectorSearchTool, WeatherTool, webSearchTool } from "./tool.js";
// import * as readline from "node:readline/promises";

// import { model } from "./model.js";

import { createAgent, providerStrategy, toolStrategy } from "langchain";
// import { model } from "./model.js";
import * as z from "zod";

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });

const agent = createAgent({
  model: model,
  tools: [WeatherTool, vectorSearchTool, webSearchTool],
  instructions: `
    You are a helpful assistant.
   and give answer under 5 lines 
  `,
});

// const messages = [];

// while (true) {
//     const value = await rl.question(">>> ");

//     if (value.toLowerCase() === "exit") {
//         console.log("Goodbye!");
//         rl.close();
//         break;
//     }

//     messages.push(new HumanMessage(value));

//     const res = await agent.invoke({
//         messages: messages,
//     });

//     const aiContent = res.messages[res.messages.length - 1].content;
//     messages.push(new AIMessage(aiContent));

//     console.log(`\nAI: ${aiContent}\n`);
// }

// "============================================================================================================"

// import * as z from "zod";
// import { createAgent, toolStrategy } from "langchain";
// import { model } from "./model.js";

// const responseSchema = z.object({
//   answer: z.string(),
//   confidence: z.number().min(0).max(1),
//   needsHuman: z.boolean(),
// });

// const agent = createAgent({
//   model: model, // your Cohere model instance
//   tools: [],
//   responseFormat: toolStrategy(responseSchema),
//   instructions: `Analyze the user's request and return a structured assessment.`,
// });

// const res = await agent.invoke({
//   messages: [{ role: "human", content: "Hey, Is React js best for frontend?" }],
// });

// console.log(res)
// console.log("=========================================================================================================================")
// console.log(res.structuredResponse);
// // { answer: "...", confidence: 0.85, needsHuman: false }   



// ======================================================================================================================================

// async function runAgent(query) {

//   const messages = [
//     {
//       role: "user",
//       content: query
//     }
//   ];

//   for (let step = 0; step < 5; step++) {

//     const response = await agent.invoke(messages);

//     if (!response.toolCall) {
//       return response.content;
//     }

//     const result = await executeTool(
//       response.toolCall.name,
//       response.toolCall.args
//     );

//     messages.push(response);

//     messages.push({
//       role: "tool",
//       content: JSON.stringify(result)
//     });
//   }
// }

// console.log(await runAgent("what is the current weather in Ranchi and Giridih and can i carry unbrella and aslo say where the rain stop on giridih or Ranchi there continuously rain is happening"))


// Implementation of planner , relection/reflactor , supervisor with multiagent and also handoff