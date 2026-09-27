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
import { HumanMessage, AIMessage } from "@langchain/core/messages";

let chatHistory = [];

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

            // Append user input to history before calling the agent
            chatHistory.push(new HumanMessage(userInput));

            try {
                // Pass the payload as an object containing the messages array
                const payload = { 
                    messages: chatHistory 
                };
                
                console.log("\n[Thinking...]");
                const result = await runWorkflowWithHandoff(agentsMap, "supervisor", payload);
                
                // Extract the clean string from the agent output
                let answerStr = result.final_answer;
                if (typeof answerStr === "object") {
                    // Depending on the agent, the final text can be in different properties
                    answerStr = answerStr.output || 
                                answerStr.content || 
                                (answerStr.messages && answerStr.messages[answerStr.messages.length - 1]?.content) || 
                                JSON.stringify(answerStr, null, 2);
                }
                
                console.log(`\n🤖 System: ${answerStr}\n`);
                
                // Append system response to history
                chatHistory.push(new AIMessage(answerStr));
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
