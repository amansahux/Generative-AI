import "dotenv/config";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import { HumanMessage } from "@langchain/core/messages";

const model = new ChatGoogleGenerativeAI({
    model: "gemini-flash-latest",
    apiKey:process.env.GEMINI_API_KEY
});

const message = new HumanMessage({
    content: "Explain Docker in simple terms."
});

const response = await model.invoke([
    message
]);

console.log(response.content);

