import { PDFParse } from "pdf-parse";
import dotenv from "dotenv";
dotenv.config();
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import fs from "fs";

const pdfData = fs.readFileSync("./story.pdf");

const parser = new PDFParse({
  data: pdfData,
});
const data = await parser.getText();
// console.log(data.text);

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 600,
  chunkOverlap: 0,
});
const texts = await splitter.splitText(data.text);
// console.log(texts)
// console.log(texts.length)

import { MistralAIEmbeddings } from "@langchain/mistralai";

const embeddings = new MistralAIEmbeddings({
  model: "mistral-embed",
  apiKey: process.env.MISTRAL_APUI_KEY,
});

const embeddedTexts = await embeddings.embedDocuments(texts);
console.log(embeddedTexts);