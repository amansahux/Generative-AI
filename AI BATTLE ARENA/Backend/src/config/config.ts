import dotenv from "dotenv"
dotenv.config()

type CONFIG = {
    readonly MISTRAL_API_KEY: string
    readonly COHERE_API_KEY: string
    readonly GEMINI_API_KEY: string
}

export const config: CONFIG = {
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY!,
    COHERE_API_KEY: process.env.COHERE_API_KEY!,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY!
}