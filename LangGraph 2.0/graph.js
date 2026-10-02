import { StateGraph, StateSchema } from "@langchain/langgraph";
import * as z from "zod";
import { checkResearchNode, combineResearchNode, errorMessageNode, generateAnswerNode, humanApproval, reflectionNode, researchNode, retrySearchNode, vectorSearchNode, webSearchNode } from "./nodes";

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

export const Graph = new StateGraph(State)
  .addNode("researchRouter", researchNode)
  .addNode("webSearch", webSearchNode)
  .addNode("vectorSearch", vectorSearchNode)
  .addNode("combineResearch", combineResearchNode)
  .addNode("checkResearch", checkResearchNode)
  .addNode("generateAnswer", generateAnswerNode)
  .addNode("reflection", reflectionNode)
  .addNode("humanApproval", humanApproval)
  .addNode("retrySearch", retrySearchNode)
  .addNode("errorMessage", errorMessageNode)

  // START
  .addEdge(START, "researchRouter")

  // Research
  .addEdge("researchRouter", "webSearch")
  .addEdge("researchRouter", "vectorSearch")

  // Parallel search → combine
  .addEdge("webSearch", "combineResearch")
  .addEdge("vectorSearch", "combineResearch")

  // Check research
  .addEdge("combineResearch", "checkResearch")

  // Research decision
  .addConditionalEdges(
    "checkResearch",
    (state) => {
      return state.needsMoreResearch
        ? "retry"
        : "generate";
    },
    {
      retry: "retrySearch",
      generate: "generateAnswer",
    }
  )

  // Retry → research again
  .addEdge("retrySearch", "researchRouter")

  // Generate → reflection
  .addEdge("generateAnswer", "reflection")

  // Reflection decision
  .addConditionalEdges(
    "reflection",
    (state) => {
      return state.qualityPassed
        ? "approved"
        : "regenerate";
    },
    {
      approved: "humanApproval",
      regenerate: "generateAnswer",
    }
  )

  // Human approval decision
  .addConditionalEdges(
    "humanApproval",
    (state) => {
      return state.approved
        ? "finish"
        : "regenerate";
    },
    {
      finish: END,
      regenerate: "generateAnswer",
    }
  )

  // Error
  .addEdge("errorMessage", END)