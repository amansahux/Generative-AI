// Loader → Splitter → Embeddings → Vector Store → Retriever → LLM   
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
console.log(chunks.length)
chunks.map((chunk) => {
    console.log(chunk)
})


// console.log(chunks);
// console.log(chunks.length);
// console.log("============================================================================================================================")
// console.log(chunks2);
// console.log(chunks2.length)

