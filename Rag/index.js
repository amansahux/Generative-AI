// Loader → Splitter → Embeddings → Vector Store → Retriever → LLM   
import dotenv from "dotenv";
dotenv.config();
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";




const loader = new TextLoader("./file.txt");
const data = await loader.load();
// console.log(data)
// console.log("==================================================================================================================================")



const loader2 = new PDFLoader("./story.pdf");
const documents = await loader2.load();

// console.log(documents[0].pageContent)
// console.log(documents)
// console.log("=================================================================================================================")

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 600,
    chunkOverlap: 50,
});

const chunks2 = await splitter.splitDocuments(data)
chunks2.map((chunk) => {
    console.log(chunk)
})
console.log(chunks2.length)
const chunks = await splitter.splitDocuments(documents);

chunks.map((chunk) => {
    console.log(chunk)
})
console.log(chunks.length)

import { MistralAIEmbeddings } from "@langchain/mistralai";

const embeddings = new MistralAIEmbeddings({
  model: "mistral-embed",
  apiKey: process.env.MISTRAL_API_KEY,
});

// embeddQuery -------> For Query
// embedDocuments -------> For Documents    

const docs1 = await embeddings.embedDocuments(chunks.map((chunk) => chunk.pageContent));
const docs2 = await embeddings.embedDocuments(chunks2.map((chunk) => chunk.pageContent))
console.log(docs1)
console.log("=========================================================================================================================================")
console.log(docs2)