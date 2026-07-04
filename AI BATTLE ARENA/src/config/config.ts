import dotenv from "dotenv";
dotenv.config();


type CONFIG = {
    PORT: string | undefined;
    GEMINI_API_KEY: string | undefined;
    MISTRAL_API_KEY: string | undefined;
    COHERE_API_KEY: string | undefined;
}
const config: CONFIG = {
    PORT: process.env.PORT,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
    COHERE_API_KEY: process.env.COHERE_API_KEY,
}

export default config;