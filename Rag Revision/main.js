import fs from "fs";
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

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

console.log(chunks);
console.log(chunks.length);
