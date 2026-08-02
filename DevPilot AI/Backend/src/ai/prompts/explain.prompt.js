/**
 * @file src/ai/prompts/explain.prompt.js
 * @description Code explanation prompt template for DevPilot AI.
 * Instructs the LLM to analyze, detail, and explain the logic of a given code snippet.
 */

import { ChatPromptTemplate } from "@langchain/core/prompts";

/**
 * Explain prompt template for analyzing and explaining source code.
 *
 * @type {ChatPromptTemplate}
 */
export const explainPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are DevPilot AI, a highly skilled and professional AI Software Engineering Assistant.
Your task is to explain the provided source code clearly and concisely.

Structure your explanation logically:
1. **Overview**: A high-level summary of the code's purpose and design.
2. **Core Logic**: A step-by-step breakdown of how the code works.
3. **Data Flow**: Explain how data flows through the variables, functions, and modules.
4. **Complexity**: Estimate the Time and Space complexity (Big O notation) if applicable.
5. **Key Takeaways & Recommendations**: Highlight any patterns or suggestions for improvements.`
  ],
  [
    "human",
    `Explain the following code:

{code}`
  ]
]);
