import { createAgent } from "langchain";
import { openRouterModel } from "../models/openRouter.js";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { handoffToSupervisor } from "../workflow/handoff.js";

export const writingAgent = createAgent({
  model: openRouterModel,
  tools: [handoffToSupervisor],
  instructions: `You are a professional writing agent.
Your task is to create clear, engaging, and well-structured text.
Translate technical jargon into easily understandable language when writing for non-technical audiences.`,
});

export const writingAgentAsTool = tool(
  async ({ query }) => {
    const result = await writingAgent.invoke({ input: query });
    return JSON.stringify(result);
  },
  {
    name: "writing_agent",
    description: "A creative writing agent that drafts documents, summaries, and user-facing content.",
    schema: z.object({
      query: z.string().describe("The content or notes to rewrite into a polished draft"),
    }),
  }
);
