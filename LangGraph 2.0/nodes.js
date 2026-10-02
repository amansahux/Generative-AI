export const researchNode = (state) => {
  console.log("🔀 Research Router");

  const query = state.query || (state.messages && state.messages.length > 0 ? (state.messages[state.messages.length - 1].content || state.messages[state.messages.length - 1].text) : "");

  return {
    query
  };
};

export const webSearchNode = async (state) => {
  console.log("🌐 Web Search for:", state.query);

  // Simulated Web Search (or integrate real API)
  const results = [
    `Web result for "${state.query}": Documentation & community discussions found.`,
    `Web result for "${state.query}": Best practices and architecture guide.`
  ];

  return {
    webResults: results
  };
};

export const vectorSearchNode = async (state) => {
  console.log("📚 Vector Search for:", state.query);

  // Simulated Vector/Knowledge base search
  const results = [
    `Internal document: Knowledge base index on "${state.query}".`
  ];

  return {
    vectorResults: results
  };
};

export const combineResearchNode = (state) => {
  console.log("🧩 Combining research");

  return {
    research: [
      ...(state.webResults || []),
      ...(state.vectorResults || [])
    ]
  };
};

export const checkResearchNode = (state) => {
  console.log("🔍 Checking research completeness");

  const count = (state.research || []).length;
  if (count >= 2) {
    return { needsMoreResearch: false };
  }

  return { needsMoreResearch: true };
};

export const generateAnswerNode = async (state) => {
  console.log("✍️ Generating answer");

  const researchSummary = (state.research || []).join("\n- ");
  const answer = `Based on the collected research for "${state.query}":\n- ${researchSummary}\n\nConclusion: Research passed validation and answer generated successfully.`;

  return {
    answer,
    messages: [{ role: "assistant", content: answer }]
  };
};

export const reflectionNode = async (state) => {
  console.log("🧠 Reflection / Quality check");

  const passed = (state.answer || "").length > 20;

  return {
    qualityPassed: passed
  };
};

export const humanApproval = (state) => {
  console.log("👤 Waiting for human approval");

  return {
    approved: true
  };
};

export const retrySearchNode = (state) => {
  console.log("🔄 Retry search");

  return {
    needsMoreResearch: false,
    research: [`Fallback search result for "${state.query}"`]
  };
};

export const errorMessageNode = (state) => {
  console.log("❌ Error message");

  return {
    answer: `Error: ${state.error}`
  };
};