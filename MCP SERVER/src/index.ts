import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";

const server = new McpServer({
  name: "my-custom-server",
  version: "1.0.0",
});

server.registerTool(
  "greet",
  {
    description: "Greet a person by name",
    inputSchema: z.object({
      name: z.string(),
    }),
  },
  async ({ name }) => {
    return {
      content: [
        {
          type: "text",
          text: `Hello ${name}! Welcome to my MCP server.`,
        },
      ],
    };
  }
);

serveStdio(() => server);