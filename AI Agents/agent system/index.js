import { createHandoffTool, runWorkflowWithHandoff } from "./workflow/handoff.js";

// Import your agents
import { supervisorAgent } from "./agents/supervisor.js";
import { codingAgent } from "./agents/codingAgent.js";
import { executerAgent } from "./agents/executer.js";
import { plannerAgent } from "./agents/planner.js";
import { researchAgent } from "./agents/researchAgent.js";
import { writingAgent } from "./agents/writingAgent.js";


/**
 * 3. AGENTS MAP FOR THE RUNNER
 * Workflow runner ko batana padega ki kaunsa ID kis agent ko map karta hai.
 */
const agentsMap = {
    "supervisor": supervisorAgent,
    "coding": codingAgent,
    "executer": executerAgent,
    "planner": plannerAgent,
    "research": researchAgent,
    "writing": writingAgent
};


/**
 * 4. RUN THE SYSTEM
 * Ek main function jo workflow start karega.
 */
import readline from "readline";

let chatHistory = "";

export async function startInteractiveTerminal() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log("==========================================");
    console.log("🤖 Supervisor Agent Terminal Started");
    console.log("Type 'exit' or 'quit' to stop.");
    console.log("==========================================\n");

    const promptUser = () => {
        rl.question("You: ", async (userInput) => {
            if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
                console.log("Goodbye!");
                rl.close();
                return;
            }

            // Append user input to history
            chatHistory += `\nUser: ${userInput}\n`;

            try {
                // Pass the entire history + current instruction as the input
                // This allows the agents to read past context
                const contextPayload = `Conversation History:\n${chatHistory}\n---\nBased on the history above, reply to the user's latest input.`;
                
                console.log("\n[Thinking...]");
                const result = await runWorkflowWithHandoff(agentsMap, "supervisor", contextPayload);
                
                // Try to extract a clean string from the Langchain agent output
                let answerStr = result.final_answer;
                if (typeof answerStr === "object") {
                    answerStr = answerStr.output || JSON.stringify(answerStr, null, 2);
                }
                
                console.log(`\n🤖 System: ${answerStr}\n`);
                
                // Append system response to history
                chatHistory += `System: ${answerStr}\n`;
            } catch (error) {
                console.error("\nWorkflow failed:", error.message);
            }

            // Loop back for the next question
            promptUser();
        });
    };

    promptUser();
}

// Start the terminal loop immediately when running `node index.js`
startInteractiveTerminal();
