import dotenv from "dotenv";
dotenv.config();


type CONFIG = {
  readonly  PORT: string | undefined;
  readonly  GEMINI_API_KEY: string | undefined;
  readonly  MISTRAL_API_KEY: string | undefined;
  readonly  COHERE_API_KEY: string | undefined;
}
const config: CONFIG = {
    PORT: process.env.PORT,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
    COHERE_API_KEY: process.env.COHERE_API_KEY,
}

export default config;