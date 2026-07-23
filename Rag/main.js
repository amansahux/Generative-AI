import { PDFParse } from "pdf-parse";
import dotenv from "dotenv";
dotenv.config();
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Pinecone } from "@pinecone-database/pinecone";
import fs from "fs";

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.index("cohort2-rag");

// const pdfData = fs.readFileSync("./story.pdf");

// const parser = new PDFParse({
//   data: pdfData,
// });
// const data = await parser.getText();
// console.log(data.text);

// const splitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 600,
//   chunkOverlap: 0,
// });
// const chunks = await splitter.splitText(data.text);
// console.log(texts)
// console.log(texts.length)

import { MistralAIEmbeddings } from "@langchain/mistralai";

const embeddings = new MistralAIEmbeddings({
  model: "mistral-embed",
  apiKey: process.env.MISTRAL_APUI_KEY,
});

// const docs = await Promise.all(
//   chunks.map(async (chunk) => {
//     const embedding = await embeddings.embedQuery(chunk);
//     return {
//       text: chunk,
//       embedding,
//     };
//   }),
// );
// console.log(docs);

// await index.upsert({
//   records: docs.map((doc, i) => ({
//     id: `doc-${i}`,
//     values: doc.embedding,
//     metadata: { text: doc.text },
//   })),
// });

const query = "How is the internship experience?";
const queryEmbedding = await embeddings.embedQuery(query);

const queryResponse = await index.query({
  vector: queryEmbedding,
  topK: 3,
  includeMetadata: true,
});
console.log(JSON.stringify(queryResponse));
