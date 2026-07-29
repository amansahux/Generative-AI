import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";
import * as z from "zod"

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

// const response = await model.invoke([
//   new SystemMessage("You are a Java teacher."),
//   new HumanMessage("Explain OOP."),
// ]);

// console.log(response.content);

// ----------------------------------------------------------------------------------------------------------------------------------------------

// const stream = await model.stream(
//   "Explain JWT in 5 lines."
// );
// const stream = await model.stream(
//   "Write a 300 word blog on MERN Stack."
// );

// console.log(stream)
// console.log("-------------------------------------------------------------------------------------------")

// for await (const chunk of stream) {
//   console.log(chunk);
// }
// for await (const chunk of stream) {
//   console.log(chunk.content);
// }


// ---------------------------------------------------------------------------------------------------------------------------------------------


// const responses = await model.batch([
//   "Explain React",
//   "Explain Node.js",
//   "Explain Express.js",
// ]);

// const responses = await model.batch([
//   [
//     new SystemMessage("You are a Java Teacher."),
//     new HumanMessage("Explain OOP"),
//   ],

//   [
//     new SystemMessage("You are a React Teacher."),
//     new HumanMessage("Explain Hooks"),
//   ],
// ]);
// console.log(responses)
// console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------")
// responses.forEach((response) => {
//   console.log(response.content);
// });



// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------

// const ResponseSchema = z.object({
//   name: z.string(),
//   age: z.number(),
//   passion: z.string(),
//   country: z.string(),
//   programmingLanguages: z.array(z.string()),
// });

// const FakeUserGenertionModel = model.withStructuredOutput(ResponseSchema);

// // const userData = await FakeUserGenertionModel.invoke([new HumanMessage("Create Fake Data of 5 users")]);
// const userData = await FakeUserGenertionModel.batch(["Create Fake Data of 2 users","Create Fake Data of 3 users"]);

// console.log(userData)
