import { PDFParse } from "pdf-parse";
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
console.log(texts)
console.log(texts.length)
