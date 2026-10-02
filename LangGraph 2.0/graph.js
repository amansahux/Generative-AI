import { StateSchema } from "@langchain/langgraph";
import * as z from "zod";

export const State = new StateSchema({
  // User's original question
  query: z.string(),

  // Search results
  webResults: z.array(z.string()).default(() => []),
  vectorResults: z.array(z.string()).default(() => []),

  // Combined research
  research: z.array(z.string()).default(() => []),

  // Research decision
  needsMoreResearch: z.boolean().default(true),

  // Generated/final answer
  answer: z.string().default(""),

  // Reflection result
  qualityPassed: z.boolean().default(false),

  // Human approval
  approved: z.boolean().default(false),

  // Error information
  error: z.string().default(""),
});