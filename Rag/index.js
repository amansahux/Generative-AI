// // Loader → Splitter → Embeddings → Vector Store → Retriever → LLM   
// import dotenv from "dotenv";
// dotenv.config();
// import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";




// const loader = new TextLoader("./file.txt");
// const data = await loader.load();
// // console.log(data)
// // console.log("==================================================================================================================================")



// const loader2 = new PDFLoader("./story.pdf");
// const documents = await loader2.load();

// // console.log(documents[0].pageContent)
// // console.log(documents)
// // console.log("=================================================================================================================")

// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// const splitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 600,
//   chunkOverlap: 50,
// });

// const chunks1 = await splitter.splitDocuments(documents);
// const chunks2 = await splitter.splitDocuments(data)


// console.log(chunks1)
// console.log("=======================================================================================================================================")
// console.log(chunks2)

// import { MistralAIEmbeddings } from "@langchain/mistralai";

// const embeddings = new MistralAIEmbeddings({
//   model: "mistral-embed",
//   apiKey: process.env.MISTRAL_API_KEY,
// });

// // embeddQuery -------> For Query
// // embedDocuments -------> For Documents    

// const docs1 = await embeddings.embedDocuments(chunks1.map((chunk) => chunk.pageContent));
// const docs2 = await embeddings.embedDocuments(chunks2.map((chunk) => chunk.pageContent))
// console.log(docs1)
// console.log("=========================================================================================================================================")
// console.log(docs2)

// import { Pinecone } from '@pinecone-database/pinecone';

// const pc = new Pinecone({
//   apiKey: process.env.PINECONE_API_KEY,
// });
// const index = pc.index('rag-learning');

// const records = docs1.map((embedding, i) => ({
//   id: `doc-${i}`,
//   values: embedding,
//   metadata: {
//     text: chunks1[i].pageContent,
//     source: chunks1[i].metadata.source,
//     page: chunks1[i].metadata.loc?.pageNumber,
//   },
// }));

// console.log("============================================================================================================================")
// console.log(records)
// console.log("=====================================================================================================================================")


// const res = await index.upsert({ records: records })
// console.log(res)
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { Pinecone } from "@pinecone-database/pinecone";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const embeddings = new MistralAIEmbeddings({
  model: "mistral-embed",
  apiKey: process.env.MISTRAL_API_KEY,
});

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pc.index("rag-learning");


export const ingestFileonPinecode = async (filePath) => {
  const extension = path.extname(filePath).toLowerCase();

  let loader;

  if (extension === ".pdf") {
    loader = new PDFLoader(filePath);
  } else if (extension === ".txt") {
    loader = new TextLoader(filePath);
  } else {
    throw new Error(`Unsupported file type: ${extension}`);
  }

  const documents = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 300,
    chunkOverlap: 50,
  });

  const chunks = await splitter.splitDocuments(documents);

  const vectors = await embeddings.embedDocuments(
    chunks.map((chunk) => chunk.pageContent)
  );

  const records = vectors.map((vector, i) => ({
    id: `${Date.now()}-${i}`,

    values: vector,

    metadata: {
      text: chunks[i].pageContent,
      source: chunks[i].metadata.source,
      page: chunks[i].metadata?.loc?.pageNumber,
    },
  }));

  await index.upsert({
    records,
  });

  return {
    success: true,
    source: filePath,
    chunks: chunks.length,
  };
};



// const res = await ingestFileonPinecode("./file.txt")
// console.log(res)

