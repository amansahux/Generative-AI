import fs from "fs";
import { PDFParse } from 'pdf-parse';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const buffer = fs.readFileSync('story.pdf');
const parser = new PDFParse({ data: buffer });
const document = await parser.getText()


const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 0 })
const texts = await splitter.splitText(document)
console.log(texts)