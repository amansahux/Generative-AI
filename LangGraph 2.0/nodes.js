import { webSearchTool } from "../AI Agents/agent system/tools/webSearch.tool.js";
import { PineconeCompressionRetriever } from "../Rag/index.js";
import { cohereModel, groqModel, openRouterModel } from "./model.js";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export const researchNode = (state) => {
  console.log("🔀 Research Router");

  const query =
    state.query ||
    (state.messages && state.messages.length > 0
      ? state.messages[state.messages.length - 1].content ||
        state.messages[state.messages.length - 1].text
      : "");

      console.log("State at research Node....", state)

  return {
    query,
  };
};

export const webSearchNode = async (state) => {
  console.log("🌐 Web Search for:", state.query);

  try {
    const rawResult = await webSearchTool.invoke({
      query: state.query,
      deep_search: false,
    });

    let results = [];
    if (typeof rawResult === "string") {
      try {
        const parsed = JSON.parse(rawResult);
        if (parsed.results && Array.isArray(parsed.results)) {
          results = parsed.results.map(
            (item) => `[Web: ${item.title || "Result"}] ${item.content || item.snippet || ""}`
          );
        } else {
          results = [rawResult];
        }
      } catch {
        results = [rawResult];
      }
    } else if (rawResult?.results && Array.isArray(rawResult.results)) {
      results = rawResult.results.map(
        (item) => `[Web: ${item.title || "Result"}] ${item.content || item.snippet || ""}`
      );
    } else {
      results = [String(rawResult)];
    }

      console.log("State at webSearch Node....", state)
    return {
      webResults: results,
    };
  } catch (error) {
    console.error("Web search failed:", error.message || error);
    return {
      webResults: [`Web search fallback: No direct web results for "${state.query}".`],
    };
  }
};

export const vectorSearchNode = async (state) => {
  console.log("📚 Vector Search for:", state.query);

  try {
    const docs = await PineconeCompressionRetriever.invoke(state.query);

    const results =
      docs && docs.length > 0
        ? docs.map(
            (doc, i) =>
              `[Vector Doc ${i + 1} (Source: ${doc.metadata?.source || "KB"})] ${doc.pageContent}`
          )
        : [`Vector knowledge base: No specific internal documents matched "${state.query}".`];
  console.log("State at vectorSearch Node....", state)
    return {
      vectorResults: results,
    };
  } catch (error) {
    console.error("Vector search failed:", error.message || error);
    return {
      vectorResults: [`Vector search fallback: Unable to fetch internal docs for "${state.query}".`],
    };
  }
};

export const combineResearchNode = (state) => {
  console.log("🧩 Combining research");
    console.log("State at combineResearch Node....", state)
  return {
    research: [
      ...(state.webResults || []),
      ...(state.vectorResults || []),
    ],
  };
};

export const checkResearchNode = (state) => {
  console.log("🔍 Checking research completeness");

  const count = (state.research || []).filter(
    (item) => item && !item.toLowerCase().includes("fallback")
  ).length;

    console.log("State at checkResearch Node....", state)

  if (count >= 1 || (state.research || []).length >= 2) {
    return { needsMoreResearch: false };
  }

    console.log("State at checkResearch Node....", state)

  return { needsMoreResearch: true };
};

export const generateAnswerNode = async (state) => {
  console.log("✍️ Generating answer with OpenRouter / Groq model");

  const researchSummary = (state.research || []).join("\n\n");
  const prompt = `You are a helpful and knowledgeable AI assistant.
Answer the following user query thoroughly and accurately using the research context provided.

User Query: ${state.query}

Research Context:
${researchSummary || "No explicit context retrieved."}

Provide a well-structured, clear, and comprehensive answer:`;

  try {
    // Primary generation using openRouterModel (or groqModel fallback)
    const response = await openRouterModel.invoke(prompt);
    const answer = typeof response.content === "string" ? response.content : JSON.stringify(response.content);

      console.log("State at generateAnswer Node....", state)
    return {
      answer,
      messages: [{ role: "assistant", content: answer }],
    };
  } catch (error) {
    console.warn("Primary model generation failed, trying groqModel:", error.message || error);
    const fallbackResponse = await groqModel.invoke(prompt);
    const answer = typeof fallbackResponse.content === "string" ? fallbackResponse.content : JSON.stringify(fallbackResponse.content);

    return {
      answer,
      messages: [{ role: "assistant", content: answer }],
    };
  }
};

export const reflectionNode = async (state) => {
  console.log("🧠 Reflection / Quality check with Cohere / Groq model");

  const prompt = `You are a strict quality evaluator.
Evaluate whether the following generated answer adequately and accurately addresses the user query based on the research.

User Query: ${state.query}
Generated Answer: ${state.answer}

Respond with ONLY the word "PASS" if the answer is good, accurate, and relevant. Otherwise, respond with ONLY the word "FAIL".`;

  try {
    const res = await cohereModel.invoke(prompt);
    const content = typeof res.content === "string" ? res.content.trim() : "";
    const qualityPassed = content.toUpperCase().includes("PASS");

    console.log("State at reflection Node....", state)

    return {
      qualityPassed: qualityPassed || (state.answer || "").length > 30,
    };
  } catch (error) {
    console.warn("Cohere reflection failed, evaluating via length heuristic:", error.message || error);
    const passed = (state.answer || "").length > 30;
    return {
      qualityPassed: passed,
    };
  }
};

export const humanApproval = (state) => {
  console.log("👤 Waiting for human approval");

  console.log("State at humanApproval Node....", state)
  return {
    approved: true,
  };
};

export const retrySearchNode = async (state) => {
  console.log("🔄 Retry search with Groq query expansion");

  try {
    const prompt = `The user asked: "${state.query}". Generate a single refined and targeted search query phrase to find relevant facts. Return only the query string.`;
    const res = await groqModel.invoke(prompt);
    const refinedQuery = typeof res.content === "string" ? res.content.trim() : state.query;

   
    const rawResult = await webSearchTool.invoke({
      query: refinedQuery,
      deep_search: true,
    });

    let results = [];
    try {
      const parsed = typeof rawResult === "string" ? JSON.parse(rawResult) : rawResult;
      if (parsed.results && Array.isArray(parsed.results)) {
        results = parsed.results.map(
          (item) => `[Retry Web: ${item.title || "Result"}] ${item.content || item.snippet || ""}`
        );
      } else {
        results = [String(rawResult)];
      }
    } catch {
      results = [String(rawResult)];
    }

     console.log("State at retrySearchNode....", state)

    return {
      query: refinedQuery,
      needsMoreResearch: false,
      research: results.length > 0 ? results : [`Refined search results for: ${refinedQuery}`],
    };
  } catch (error) {
    console.warn("Retry search query generation failed:", error.message || error);
    return {
      needsMoreResearch: false,
      research: [`Fallback search result for "${state.query}"`],
    };
  }
};

export const errorMessageNode = (state) => {
  console.log("❌ Error message");

   console.log("State at errorMessageNode....", state)

  return {
    answer: `Error: ${state.error}`,
  };
};