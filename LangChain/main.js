import "dotenv/config";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import { HumanMessage } from "@langchain/core/messages";
import { PromptTemplate } from "@langchain/core/prompts";
const model = new ChatGoogleGenerativeAI({
    model: "gemini-flash-latest",
    apiKey:process.env.GEMINI_API_KEY
});

// const message = new HumanMessage({
//     content: "Explain Docker in simple terms."
// });

// const response = await model.invoke([
//     message
// ]);

// console.log(response.content);

// import "dotenv/config";

// import readline from "readline/promises";
// import { stdin as input, stdout as output } from "process";

// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// import {
//     HumanMessage,
//     AIMessage,
//     SystemMessage
// } from "@langchain/core/messages";


// // ----------------------------
// // Create Model
// // ----------------------------

// const model = new ChatGoogleGenerativeAI({
//      model: "gemini-flash-latest",
//     apiKey:process.env.GEMINI_API_KEY
// });


// // ----------------------------
// // Conversation History
// // ----------------------------

// const messages = [

//     new SystemMessage({
//         content: `
// You are an experienced MERN + Generative AI mentor.

// Explain everything in Hinglish.

// Give practical examples.

// Keep answers easy to understand.
// `
//     })

// ];


// // ----------------------------
// // Terminal Input
// // ----------------------------

// const rl = readline.createInterface({
//     input,
//     output
// });


// // ----------------------------
// // Chat Loop
// // ----------------------------

// while (true) {

//     const prompt = await rl.question("\nYou : ");

//     if (prompt.toLowerCase() === "exit") {
//         break;
//     }

//     // Store User Message

//     messages.push(

//         new HumanMessage({
//             content: prompt
//         })

//     );



//     // Send Complete History

//     const response = await model.invoke(messages);



//     // Print AI Response

//     console.log("\nAI :", response.content);



//     // Store AI Response

//     messages.push(response);

// }


// // Close Terminal

// rl.close();





// const prompt = PromptTemplate.fromTemplate(
// `Hello {name}

// Welcome to {course}
// from this day we start the course of {course}

// `




// );

// const result = await prompt.invoke({

//     name:"Aman",

//     course:"LangChain"

// });

// console.log(result.toString());



const template = PromptTemplate.fromTemplate(`

You are an experienced teacher.

Explain {topic}

Difficulty Level :

{level}

`);

const prompt = await template.invoke({

    topic:"Docker",

    level:"Beginner"

});

const response = await model.invoke(prompt.toString());

console.log(response.content);