import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";
import * as z from "zod"
import fs from "fs";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-flash-latest",
  apiKey: process.env.GEMINI_API_KEY,
});

const multimodal_model = new ChatGoogleGenerativeAI({
  model: "gemini-3.5-flash-lite",
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



//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//             FOR LOCAL IMAGE
const imageBuffer = fs.readFileSync("./image.png");
const base64_1 = imageBuffer.toString("base64");
const dataUrl1 = `data:image/jpeg;base64,${base64_1}`;



//             FOR ONLINE IMAGE
const image = await fetch("https://imgs.search.brave.com/I-_cysJgJjWMxE5AnJNCmflk116zMdsfGH7ON7QcsZQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9wbHVz/LnVuc3BsYXNoLmNv/bS9wcmVtaXVtX3Bo/b3RvLTE3MjM3MzMx/MDQzMjItODI3MTg2/YjVlYjllP2ZtPWpw/ZyZxPTYwJnc9MzAw/MCZhdXRvPWZvcm1h/dCZmaXQ9Y3JvcCZp/eGxpYj1yYi00LjEu/MCZpeGlkPU0zd3hN/akEzZkRCOE1IeHpa/V0Z5WTJoOE1YeDhi/Mk4wYjNCMWMzeGxi/bnd3Zkh3d2ZIeDhN/QT09")

const arrayBuffer = await image.arrayBuffer();
const mimeType = image.headers.get("content-type");
const base64_2 = Buffer.from(arrayBuffer).toString("base64");
const dataUrl2 = `data:${mimeType};base64,${base64_2}`;
// console.log(dataUrl)


const response = await multimodal_model.invoke([
  new HumanMessage({
    content: [
      {
        type: "text",
        text: "Describe these images one by one."
      },
      {
        type: "image_url",
        image_url: {
          url: dataUrl1
        }
      },
      {
        type: "image_url",
        image_url: {
          url: dataUrl2
        }
      }
    ]
  })
]);

console.log(response)

console.log("---------------------------------------------------------------------------------")

console.log(response.content)