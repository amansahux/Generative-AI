import { createHandoffTool, runWorkflowWithHandoff } from "./workflow/handoff.js";

// Import your agents
import { supervisorAgent } from "./agents/supervisor.js";
import { codingAgent } from "./agents/codingAgent.js";
import { executerAgent } from "./agents/executer.js";
import { plannerAgent } from "./agents/planner.js";
import { researchAgent } from "./agents/researchAgent.js";
import { writingAgent } from "./agents/writingAgent.js";

/**
 * 1. CREATE HANDOFF TOOLS
 * Hum handoff tools banayenge jo agents ek dusre ko pass karne ke liye use karenge.
 */

// Supervisor ke liye tools (Supervisor baaki sab ko task dega)
const handoffToCoding = createHandoffTool("coding", "Pass coding and debugging tasks to the Coding Agent.");
const handoffToExecuter = createHandoffTool("executer", "Pass execution and testing tasks to the Executer Agent.");
const handoffToPlanner = createHandoffTool("planner", "Pass complex requests to the Planner Agent to break down into steps.");
const handoffToResearch = createHandoffTool("research", "Pass factual queries and search tasks to the Research Agent.");
const handoffToWriting = createHandoffTool("writing", "Pass drafting and formatting tasks to the Writing Agent.");

// Specialist agents ke liye tool (taaki wo apna kaam khatam karke wapas Supervisor ko control de sakein)
const handoffToSupervisor = createHandoffTool("supervisor", "Return control to the Supervisor after you have finished your specific task or if you need further instructions.");


/**
 * 2. ASSIGN HANDOFF TOOLS TO AGENTS
 * Ab humein in agents me ye handoff tools add karne honge.
 * (Note: Agar humne agents pehle define kar diye hain, toh hum unme dynamic tools push kar sakte hain)
 */

// Supervisor ko baaki sab ka access de diya
supervisorAgent.tools.push(
    handoffToCoding,
    handoffToExecuter,
    handoffToPlanner,
    handoffToResearch,
    handoffToWriting
);

// Har specialist ko supervisor ka access de diya (taaki wo loop me na phasein)
codingAgent.tools.push(handoffToSupervisor);
executerAgent.tools.push(handoffToSupervisor);
plannerAgent.tools.push(handoffToSupervisor);
researchAgent.tools.push(handoffToSupervisor);
writingAgent.tools.push(handoffToSupervisor);


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
export async function startAgentSystem(userRequest) {
    console.log(`Starting Workflow for request: "${userRequest}"`);
    
    try {
        // Hamesha 'supervisor' se start karenge
        const result = await runWorkflowWithHandoff(agentsMap, "supervisor", userRequest);
        console.log("\n--- WORKFLOW COMPLETE ---");
        console.log("Final Answer:", result.final_answer);
        console.log("\nHistory Trace:", result.history);
        return result;
    } catch (error) {
        console.error("Workflow failed:", error);
    }
}

// Example usage uncomment to test:
// startAgentSystem("Write a python script to fetch weather of Delhi and test it.");
