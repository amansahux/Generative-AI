import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MistralAIEmbeddings } from "@langchain/mistralai";

import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.index("rag-revision");

// const buffer = fs.readFileSync("story.pdf");
// const parser = new PDFParse({ data: buffer });
// const document = await parser.getText();
// // console.log(document.text)
// const text = String(document.text);

// const splitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 500,
//   chunkOverlap: 0,
// });
// const chunks = await splitter.splitText(text);

// console.log(chunks);
// console.log(chunks.length);

const embeddings = new MistralAIEmbeddings({
  model: "mistral-embed",
  apiKey: process.env.MISTRAL_API_KEY,
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
// console.log(docs.length)

// await index.upsert(
//   docs.map((doc, i) => ({
//     id: `doc-${i}`,
//     values: doc.embedding,
//     metadata: {
//       text: doc.text,
//     },
//   })),
// );
// console.log(res)

// const query = "How is the internship experience?";
// const queryEmbedding = await embeddings.embedQuery(query);

// const queryResponse = await index.query({
//   vector: queryEmbedding,
//   topK: 3,
//   includeMetadata: true,
// });
// console.log(JSON.stringify(queryResponse));
const query = "What arav relized after listening the advice of senior?";
const queryEmbedding = await embeddings.embedQuery(query);

const queryResponse = await index.query({
  vector: queryEmbedding,
  topK: 3,
  includeMetadata: true,
});
console.log(JSON.stringify(queryResponse));