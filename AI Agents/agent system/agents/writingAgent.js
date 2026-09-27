import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { openRouterModel } from "../models/openRouter.js";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const tools = []; // Writing agent just formats and writes.

const writingAgent = createReactAgent({
  llm: openRouterModel,
  tools,
  messageModifier: `You are a professional writing agent.
Your task is to create clear, engaging, and well-structured text.
Translate technical jargon into easily understandable language when writing for non-technical audiences.`,
});

export const writingAgentAsTool = tool(
  async ({ query }) => {
    const result = await writingAgent.invoke({ messages: [{ role: "user", content: query }] });
    return result.messages[result.messages.length - 1].content;
  },
  {
    name: "writing_agent",
    description: "A creative writing agent that drafts documents, summaries, and user-facing content.",
    schema: z.object({
      query: z.string().describe("The content or notes to rewrite into a polished draft"),
    }),
  }
);
