/**
 * @file ai/chains/chat.chain.js
 * @description Creates the main conversational AI response generation pipeline for DevPilot AI.
 * Uses the latest stable LangChain JS APIs (LCEL) to construct a provider-agnostic, reusable chain.
 */

import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableLambda } from "@langchain/core/runnables";
import { systemPrompt } from "../prompts/system.prompt.js";
import { formatOutput } from "../runnable/formatter.js";
import { logInvocation } from "../runnable/logger.js";
import { recordInvocation } from "../runnable/analytics.js";

/**
 * Creates and returns the LCEL Chat Chain pipeline.
 *
 * @param {Object} model - The injected LangChain Chat Model instance (e.g., ChatGoogleGenerativeAI, ChatOpenAI).
 * @returns {import("@langchain/core/runnables").Runnable} The configured LCEL chain.
 *
 * @example
 * const chatChain = createChatChain(geminiModel);
 * const response = await chatChain.invoke({
 *   history: [new HumanMessage("Hello"), new AIMessage("Hi there!")],
 *   input: "Explain recursion.",
 *   sessionId: "session-123" // Optional: used by logging/analytics
 * });
 */
export const createChatChain = (model) => {
  if (!model) {
    throw new Error("A model instance must be provided to createChatChain.");
  }

  // 1. Build the Prompt Template.
  // Combines system instructions, the past conversation history, and the latest user message.
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    new MessagesPlaceholder("history"),
    ["human", "{input}"],
  ]);

  // 2. Define Custom Runnables using RunnableLambda to fit into the LCEL pipeline.
  
  // Formatter: Runs formatOutput on the raw string response.
  const formatterRunnable = new RunnableLambda({
    func: async (state) => {
      const formatted = await formatOutput(state.output);
      
      // Fallback: If formatOutput returns a placeholder or empty object, preserve the original output.
      let finalOutput = state.output;
      if (typeof formatted === "string") {
        finalOutput = formatted;
      } else if (formatted && typeof formatted === "object" && typeof formatted.content === "string") {
        finalOutput = formatted.content;
      }

      return {
        ...state,
        output: finalOutput,
      };
    },
  });

  // Logger: Logs the invocation parameters (sessionId, input, output).
  const loggerRunnable = new RunnableLambda({
    func: async (state) => {
      logInvocation({
        sessionId: state.sessionId,
        input: state.input,
        output: state.output,
      });
      return state;
    },
  });

  // Analytics: Records performance metrics (latency, token usage) for the invocation.
  const analyticsRunnable = new RunnableLambda({
    func: async (state) => {
      const latencyMs = Date.now() - state.startTime;
      
      // Estimate token count based on typical word-to-token ratio
      const wordCount = state.output ? state.output.split(/\s+/).length : 0;
      const tokenCount = Math.ceil(wordCount * 1.33);

      await recordInvocation({
        sessionId: state.sessionId,
        tokenCount,
        latencyMs,
      });
      
      return state;
    },
  });

  // Final Extractor: Returns only the final string output from the state object.
  const outputExtractor = new RunnableLambda({
    func: (state) => state.output,
  });

  // 3. Compose and Return the LCEL pipeline.
  // The state wrapper passes metadata (startTime, sessionId) along the chain
  // so downstream Runnables (logger, analytics) can access them.
  const chain = RunnableLambda.from((input) => ({
    input: input.input,
    history: input.history || [],
    sessionId: input.sessionId || "default-session",
    startTime: Date.now(),
  }))
    .pipe(async (state) => {
      // Format the prompt and invoke the model
      const formattedPrompt = await prompt.formatMessages({
        input: state.input,
        history: state.history,
      });
      
      const response = await model.invoke(formattedPrompt);
      const output = await new StringOutputParser().invoke(response);
      
      return {
        ...state,
        output,
      };
    })
    .pipe(formatterRunnable)
    .pipe(loggerRunnable)
    .pipe(analyticsRunnable)
    .pipe(outputExtractor);

  return chain;
};
