import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MistralAIEmbeddings } from "@langchain/mistralai";

const buffer = fs.readFileSync("story.pdf");
const parser = new PDFParse({ data: buffer });
const document = await parser.getText();
// console.log(document.text)
const text = String(document.text);

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 0,
});
const chunks = await splitter.splitText(text);

// console.log(chunks);
// console.log(chunks.length);


const embeddings = new MistralAIEmbeddings({
  model: "mistral-embed",
  apiKey:process.env.MISTRAL_API_KEY
});

const docs = await Promise.all(
  chunks.map(async (chunk) => {
    const embedding = await embeddings.embedQuery(chunk);
    return {
      text: chunk,
      embedding,
    };
  }),
);
console.log(docs)