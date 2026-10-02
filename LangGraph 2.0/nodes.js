export const researchNode = (state) => {
  console.log("🔀 Research Router");

  return {
    query: state.query
  };
};

export const webSearchNode = async (state) => {
  console.log("🌐 Web Search");

  // Later: Tavily / web search API
  const results = [
    "Web result 1",
    "Web result 2",
    "Web result 3"
  ];

  return {
    webResults: results
  };
};
export const vectorSearchNode = async (state) => {
  console.log("📚 Vector Search");

  // Later: Pinecone / Qdrant / Chroma
  const results = [
    "Internal document 1",
    "Internal document 2"
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
  console.log("🔍 Checking research");

  if (state.research.length >= 3) {
    return "generate";
  }

  return "research";
};

export const generateAnswerNode = async (state) => {
  console.log("✍️ Generating answer");

  // Later: LLM call
  const answer = `
    Answer based on:
    ${state.research.join("\n")}
  `;

  return {
    answer
  };
};

export const reflectionNode = async (state) => {
  console.log("🧠 Reflection");

  // Later: LLM evaluates answer
  const passed = state.answer.length > 50;

  return {
    qualityPassed: passed
  };
};

export const humanApproval = (state) => {
  console.log("👤 Waiting for human approval");

  // Later this becomes actual interrupt/resume
  return {
    approved: true
  };
};
export const retrySearchNode = (state) => {
  console.log("🔄 Retry search");

  return {
    needsMoreResearch: true,
    research: []
  };
};
export const errorMessageNode = (state) => {
  console.log("❌ Error message");

  return {
    answer: `Error: ${state.error}`
  };
};