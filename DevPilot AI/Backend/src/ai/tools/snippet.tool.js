/**
 * @file ai/tools/snippet.tool.js
 * @description Placeholder for the Code Snippet AI tool.
 * This tool will allow the AI to save and retrieve code snippets for the user.
 */

/**
 * Snippet tool definition.
 * No implementation — placeholder only.
 *
 * @type {Object}
 */
import Snippet from "../../models/snippet.model.js";

export const snippetTool = {
  name: "snippet",
  description: "Saves or retrieves code snippets for the authenticated user.",

  execute: async ({ action, title, language = "plaintext", code, snippetId, userId }) => {
    try {
      if (!userId) {
        return "Error: Authenticated user identifier (userId) is required to manage snippets.";
      }

      switch (action) {
        case "save": {
          if (!title || !code) {
            return "Error: Both title and code are required to save a snippet.";
          }
          const snippet = await Snippet.create({
            userId,
            title,
            language,
            code,
          });
          return JSON.stringify({
            message: "Snippet saved successfully.",
            snippet: {
              id: snippet._id,
              title: snippet.title,
              language: snippet.language,
              code: snippet.code,
              createdAt: snippet.createdAt,
            },
          }, null, 2);
        }

        case "get": {
          if (snippetId) {
            const snippet = await Snippet.findOne({ _id: snippetId, userId });
            if (!snippet) {
              return `Error: Snippet not found with ID ${snippetId} for this user.`;
            }
            return JSON.stringify({
              message: "Snippet retrieved successfully.",
              snippet: {
                id: snippet._id,
                title: snippet.title,
                language: snippet.language,
                code: snippet.code,
                createdAt: snippet.createdAt,
              },
            }, null, 2);
          } else {
            // If no snippetId is specified, retrieve all snippets list (metadata only to be efficient)
            const snippets = await Snippet.find({ userId }).select("title language createdAt").sort({ createdAt: -1 });
            return JSON.stringify({
              message: `Retrieved ${snippets.length} snippets.`,
              snippets: snippets.map(s => ({
                id: s._id,
                title: s.title,
                language: s.language,
                createdAt: s.createdAt,
              })),
            }, null, 2);
          }
        }

        default:
          return `Error: Unknown action "${action}". Supported actions are "save", "get".`;
      }
    } catch (error) {
      return `Error managing code snippets: ${error.message}`;
    }
  },
};
