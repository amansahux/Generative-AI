import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { graph } from "./graph.js";

async function runTerminalChat() {
  const rl = readline.createInterface({ input, output });
  const threadId = "terminal-session-" + Date.now();
  const config = { configurable: { thread_id: threadId } };

  console.log("\n========================================================");
  console.log(" 🚀 Welcome to LangGraph 2.0 Multi-Turn Interactive Chat");
  console.log("========================================================");
  console.log("Commands:");
  console.log("  • Type 'exit' or 'quit' to exit");
  console.log("  • Type '/history' to see conversation history");
  console.log("  • Type '/clear' to start a fresh thread");
  console.log("--------------------------------------------------------\n");

  let currentConfig = config;

  while (true) {
    try {
      const userInput = await rl.question("\x1b[36mYou: \x1b[0m");

      const trimmed = userInput.trim();
      if (!trimmed) continue;

      if (trimmed.toLowerCase() === "exit" || trimmed.toLowerCase() === "quit") {
        console.log("\n👋 Exiting chat. Goodbye!\n");
        rl.close();
        break;
      }

      if (trimmed === "/clear") {
        currentConfig = { configurable: { thread_id: "terminal-session-" + Date.now() } };
        console.log("\n🧹 Conversation history cleared (new thread started).\n");
        continue;
      }

      if (trimmed === "/history") {
        const state = await graph.getState(currentConfig);
        const messages = state?.values?.messages || [];
        console.log("\n📜 --- Conversation History ---");
        if (messages.length === 0) {
          console.log("No messages yet.");
        } else {
          messages.forEach((msg, idx) => {
            const role = msg.role || (msg._getType ? msg._getType() : "message");
            const content = typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content);
            console.log(`[${idx + 1}] [${role.toUpperCase()}]: ${content}`);
          });
        }
        console.log("-------------------------------\n");
        continue;
      }

      console.log("\n⏳ \x1b[33mProcessing graph nodes...\x1b[0m");

      const result = await graph.invoke(
        {
          messages: [{ role: "user", content: trimmed }],
          query: trimmed
        },
        currentConfig
      );

      console.log("\n\x1b[32m🤖 Assistant:\x1b[0m");
      console.log(result.answer || "No response generated.");
      console.log("\n" + "─".repeat(56) + "\n");
    } catch (error) {
      console.error("\n❌ Error during graph execution:", error.message || error);
    }
  }
}

runTerminalChat();
