/**
 * @file src/ai/prompts/readme.prompt.js
 * @description README.md generation prompt template for DevPilot AI.
 * Instructs the AI to write structured, comprehensive project documentation.
 */

import { ChatPromptTemplate } from "@langchain/core/prompts";

/**
 * README prompt template.
 *
 * @type {ChatPromptTemplate}
 */
export const readmePrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are DevPilot AI, a highly skilled and professional AI Software Engineering Assistant.
Generate a comprehensive, clean, and professional README.md markdown file for a software project based on the details provided.

The generated README.md must contain the following sections:
1. **Project Title**: A clear name and short tagline.
2. **Description**: A comprehensive overview of what the project does and the problems it solves.
3. **Key Features**: Highlight the primary capabilities and selling points.
4. **Tech Stack**: A clean list of languages, frameworks, libraries, and tools.
5. **Prerequisites & Installation**: Step-by-step instructions to clone, install dependencies, and configure environment variables.
6. **Running the Application**: CLI commands to start development, testing, and production environments.
7. **Project Directory Structure**: A tree representation of directories and files.
8. **Usage Examples / API Endpoints**: Simple code snippets, request/response examples, or screenshots placeholders.
9. **License**: Clear license details (e.g., MIT).`
  ],
  [
    "human",
    `Generate a professional README.md file based on the following project details, source files, or summary context:

{context}`
  ]
]);
