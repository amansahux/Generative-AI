import { createAgent } from "langchain";
import { openRouterModel } from "../models/openRouter.js";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { HumanMessage } from "@langchain/core/messages";
// import { handoffToSupervisor } from "../workflow/handoff.js";

export const writingAgent = createAgent({
  model: openRouterModel,
  tools: [],
  instructions: `You are a professional writing agent.
Your task is to create clear, engaging, and well-structured text.
Translate technical jargon into easily understandable language when writing for non-technical audiences.`,
});

export const writingAgentAsTool = tool(
  async ({ query }) => {
    console.log("writing agent executed>>>>>>>>>>>>>>>")
    const result = await writingAgent.invoke({ messages: [new HumanMessage(query)] });
    const lastMsg = result?.messages?.[result.messages.length - 1];
    return lastMsg?.content || JSON.stringify(result);
  },
  {
    name: "writing_agent",
    description: "A creative writing agent that drafts documents, summaries, and user-facing content.",
    schema: z.object({
      query: z.string().describe("The content or notes to rewrite into a polished draft"),
    }),
  }
);
