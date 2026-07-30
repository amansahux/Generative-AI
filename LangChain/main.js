import "dotenv/config";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import * as z from "zod"

import { HumanMessage } from "@langchain/core/messages";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatGoogleGenerativeAI({
    model: "gemini-flash-latest",
    apiKey: process.env.GEMINI_API_KEY
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



// const template = PromptTemplate.fromTemplate(`

// You are an experienced teacher.

// Explain {topic}

// Difficulty Level :

// {level}

// `);

// const prompt = await template.invoke({

//     topic: "Docker",

//     level: "Beginner"

// });
// console.log(prompt.toString())

// const response = await model.invoke(prompt.toString());

// console.log(response.content);

//------------------------------------------------------------------------------------------------------------------------------------------------

// const template = ChatPromptTemplate.fromMessages([

// ["system","You are an expert {topic} Teacher"],

// ["human","Explain {topic}"]

// ]);

// const prompt =  await template.invoke({
//     topic:"AWS"
// })
// console.log(prompt.messages)

// const response = await model.invoke(

// prompt.messages

// );

// console.log(response.content);

//-------------------------------------------------------------------------------------------------------------------------------------------------

import { JsonOutputParser, StringOutputParser, StructuredOutputParser } from "@langchain/core/output_parsers";
import { RunnableParallel, RunnableSequence } from "@langchain/core/runnables";

// const parser = new JsonOutputParser();

// const prompt = `
// kya tum mughe ek student ki fake deatils ke skte ho?

// Return ONLY valid JSON.

// {
//   "name":"",
//   "age":0,
//   "skills":[],
//   "summery":""
// }
// `;


// const response = await model.invoke(prompt);
// console.log(response.content)
// console.log("--------------------------------------------------------------------------------")

// const result = await parser.invoke(response);
// // const result = await parser.parse(response.content);

// console.log(result);


// const parser = new JsonOutputParser();

// const template = PromptTemplate.fromTemplate(`
// Generate a student.

// {format_instructions}
// `);

// const prompt = await template.invoke({

// format_instructions:


// parser.getFormatInstructions()

// });

// console.log(prompt.toString());

//-------------------------------------------------------------------------------------------------------------------------------------------------

// const student_schema = z.object({
//     name: z.string(),
//     state: z.string(),
//     progress: z.enum(["learning", "applying", "working"]),
//     skills: z.array(z.string()),
//     experience: z.number().min(0).max(5)
// })

// const parser = new StructuredOutputParser(student_schema);

// const template = PromptTemplate.fromTemplate(`

// Generate student information.

// Topic:

// {topic}

// {format}

// `);

// const prompt = await template.invoke({

//     topic: "MERN Developer",

//     format: parser.getFormatInstructions()

// });

// const response = await model.invoke(

//     prompt.toString()

// );
// console.log(response.content)

// const result = await parser.invoke(response);

// console.log(result);



//----------------------------------------------------------------------------------------------------------------------------------------------

// const parser1 = new StringOutputParser(); // turn ai response into string

// const template1 = PromptTemplate.fromTemplate(`
// Explain {topic}
// `);

// const prompt = await template1.invoke({
//     topic: "Docker"
// });

// const response = await model.invoke(prompt);

// const result1 = await parser1.invoke(response);

// console.log(result1);


// console.log("--------------------------------------------------------------------------------------------------------------------------")


// const parser2 = new StringOutputParser();

// const template2 = PromptTemplate.fromTemplate(`
// Explain {topic}
// `);

// const chain = template2 //---------------------------------> RunnableSequence
//     .pipe(model)
//     .pipe(parser2);

// const result2 = await chain.invoke({
//     topic: "Docker"
// });

// console.log(result2);          

// -------------------------------------------------------------------------------------------------------------------------------------------

// import { RunnableSequence } from "@langchain/core/runnables";

// const student_schema = z.object({
//     name: z.string(),
//     state: z.string(),
//     progress: z.enum(["learning", "applying", "working"]),
//     skills: z.array(z.string()),
//     experience: z.number().min(0).max(5)
// })

// const parser = new StructuredOutputParser(student_schema);

// const template = PromptTemplate.fromTemplate(
//     "give real looking data of student {format} about {topic}"
// );

// const chain = RunnableSequence.from([
//     template,
//     model,
//     parser
// ]);

// const result = await chain.invoke({
//     topic: "AI/ML",
//     format: parser.getFormatInstructions()
// });

// console.log(result);


//-------------------------------------------------------------------------------------------------------------------------------------------


// const parser = new StringOutputParser();

// const englishPrompt = PromptTemplate.fromTemplate(`
// Explain {topic} in English under 5 lines.
// `);

// const hindiPrompt = PromptTemplate.fromTemplate(`
// Explain {topic} in Hindi under 5 lines.
// `);

// const englishChain = englishPrompt
// .pipe(model)
// .pipe(parser);

// const hindiChain = hindiPrompt
// .pipe(model)
// .pipe(parser);

// const {englishResponse,hindiResponse} = await RunnableParallel.from({
//     englishResponse:englishChain,
//     hindiResponse:hindiChain
// }).invoke({
//     topic:"Docker"
// })


// console.log(englishResponse);
// console.log("--------------------------------------------------------------------------------------------------------------------------------------------------------")
// console.log(hindiResponse);

// const parallel = RunnableParallel.from({

//     english: englishChain,

//     hindi: hindiChain

// });

// const result = await parallel.invoke({

//     topic: "Docker"

// });

// console.log(result);


//--------------------------------------------------------------------------------------------------------------------------------------------------

import { RunnableLambda } from "@langchain/core/runnables";

// const greet = RunnableLambda.from((name) => {

//     return `Hello ${name}`;

// });


// const result = await greet.invoke("Aman");

// console.log(result);


// const uppercase = RunnableLambda.from((data) => { return data.toUpperCase() })
// const result2 = await uppercase.invoke("Aman")

// console.log(result2);



// const square = RunnableLambda.from((number) => {

//     return number * number;

// });

// console.log(

//     await square.invoke(10)

// );

// const delay = RunnableLambda.from(async (text) => {

//     await new Promise(

//         resolve => setTimeout(resolve, 2000)

//     );

//     return text;

// });

// console.log(await delay.invoke("I m a disco dancer"))


// const template = PromptTemplate.fromTemplate(`
// {instructions}

// explain {topic} under 10 line in simple words in english
// `)
// const topic_schema = z.object({
//     summary: z.string(),
//     explanation: z.array(z.string()),
//     keywords: z.array(z.string()),
//     applications: z.array(z.string()),
//     related_topics: z.array(z.string()),
// })
// const parser = new StructuredOutputParser(topic_schema);
// // const uppercase = RunnableLambda.from((text) => { return text.toUpperCase() })
// // const length = RunnableLambda.from((obj) => {  obj.length })
// const summary = RunnableLambda.from((obj) => {
//     console.log(obj["summary"])
//     return obj
// })


// const parallel = RunnableParallel.from({
//     // uppercase: uppercase,
//     // length: length
//     summary: summary
// })

// const chain1 = template.pipe(model).pipe(parser).pipe(parallel)
// const chain2 = RunnableSequence.from([
//     template,
//     model,
//     parser,
//     parallel
// ])


// console.log(await chain1.invoke({ topic: "GLSL", instructions: parser.getFormatInstructions() }));
// console.log("=======================================================================================================")

// console.log(await chain2.invoke({ topic: "GLSL", instructions: parser.getFormatInstructions() }));



//------------------------------------------------------------------------------------------------------------------------------------------------

import { tool } from "@langchain/core/tools";
const weatherTool = tool(

    async ({ city }) => {

        return `The weather in ${city} is 28°C`;

    },

    {

        name: "weather",

        description: "Get the current weather of a city.",

        schema: z.object({
            city: z.string()
        })

    }

);


// const result = await weatherTool.invoke({
//     city:"Ranchi"
// });

// console.log(result);

//------------------------------------------------------------------------------------------------------------------------------------------

import { ToolMessage } from "@langchain/core/messages";
const modelWithTools = model.bindTools([
    weatherTool
]);

const response = await modelWithTools.invoke(

    "What's the weather in Ranchi?" 

);
// console.log(response.content)

const toolCall = response.tool_calls[0];
// console.log(toolCall)

const toolResult = await weatherTool.invoke(
    toolCall.args
);

// console.log(toolResult);

const toolMessage = new ToolMessage({

content: toolResult,

tool_call_id: toolCall.id

});
const finalResponse = await modelWithTools.invoke([

new HumanMessage(

"What's the weather in Ranchi?"

),

response,

toolMessage

]);

console.log(finalResponse.content)