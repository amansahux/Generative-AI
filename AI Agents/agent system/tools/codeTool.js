const { tool } = require("@langchain/core/tools");
const { z } = require("zod");

const codeTool = tool(
    async ({ code, language }) => {
        // Mock execution
        return JSON.stringify({ output: \`Executed \${language} code successfully. (Mock output)\` });
    },
    {
        name: "execute_code",
        description: "Execute code snippets in a safe environment",
        schema: z.object({
            code: z.string().describe("The code to execute"),
            language: z.string().describe("The programming language of the code"),
        }),
    }
);

module.exports = { codeTool };
