/**
 * @file ai/tools/readme.tool.js
 * @description Placeholder for the README Generator AI tool.
 * This tool will allow the AI to generate a README.md file for a given project.
 */

/**
 * README tool definition.
 * No implementation — placeholder only.
 *
 * @type {Object}
 */
import { geminiModel } from "../model.js";

export const readmeTool = {
  name: "readme",
  description: "Generates a professional README.md file based on a project description.",

  execute: async ({ projectName, projectDescription, techStack }) => {
    try {
      if (!projectName || !projectDescription) {
        return "Error: Both projectName and projectDescription are required.";
      }

      const prompt = `You are a professional documentation generator. Generate a premium, comprehensive, and beautiful README.md for the following project:
Project Name: ${projectName}
Description: ${projectDescription}
${techStack ? `Tech Stack: ${techStack}` : ""}

Please include sections for:
- Features
- Installation Instructions
- Usage Guide
- Contributing
- License

Return only the markdown content, with no markdown code blocks wrapping the entire output.`;

      const response = await geminiModel.invoke([
        ["system", "You are an expert technical writer and developer assistant."],
        ["human", prompt]
      ]);

      return response.content;
    } catch (error) {
      return `Error generating README: ${error.message}`;
    }
  },
};
