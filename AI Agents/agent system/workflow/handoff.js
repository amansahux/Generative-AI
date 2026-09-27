import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { HumanMessage } from "@langchain/core/messages";

/**
 * Creates a real handoff tool that signals the workflow runner to route execution
 * to a different specialist agent.
 * 
 * @param {string} targetAgentId - The unique ID/name of the agent to hand off to.
 * @param {string} description - Instructions for the agent on when to use this handoff.
 */
export const createHandoffTool = (targetAgentId, description) => {
    return tool(
        async ({ input_for_agent }) => {
            // A real handoff tool returns a structured payload.
            // We stringify it so it conforms to the standard LangChain Tool interface (which expects strings),
            // but we include a special signature `__is_handoff` so the runner can intercept it.
            return JSON.stringify({
                __is_handoff: true,
                target_agent: targetAgentId,
                payload: input_for_agent
            });
        },
        {
            name: `handoff_to_${targetAgentId}`,
            description: description,
            schema: z.object({
                input_for_agent: z.string().describe(`The context, task, instructions, or question to send to the ${targetAgentId}`),
            }),
        }
    );
};

/**
 * A robust workflow runner that natively understands and processes handoffs.
 * It executes the active agent, parses its output, and if it detects a handoff payload,
 * it safely switches the active agent and continues the loop until a final answer is reached.
 * 
 * @param {Object} agentsMap - A dictionary mapping agent IDs to their initialized agent instances.
 * @param {string} initialAgentId - The ID of the agent that starts the workflow (e.g., 'supervisor').
 * @param {Object} initialPayload - The initial payload object (e.g. { input, chat_history }).
 */
export async function runWorkflowWithHandoff(agentsMap, initialAgentId, initialPayload) {
    let currentAgentId = initialAgentId;
    let currentPayload = initialPayload;
    const history = []; // Keep a ledger of the workflow execution

    // Set a max iterations limit to prevent infinite handoff loops between agents
    const MAX_STEPS = 15;
    
    for (let step = 0; step < MAX_STEPS; step++) {
        const agent = agentsMap[currentAgentId];
        if (!agent) {
            throw new Error(`[Workflow Error] Agent '${currentAgentId}' not found in agentsMap.`);
        }

        console.log(`[Workflow] Routing to: ${currentAgentId}...`);
        
        // Execute the current agent with the payload object
        const result = await agent.invoke(currentPayload);
        
        // Check if the result contains our special handoff payload.
        // Some agents might return the raw stringified JSON of the tool if it was their last action.
        let isHandoff = false;
        let parsedResult = result;
        
        try {
            const parsed = JSON.parse(result);
            if (parsed && parsed.__is_handoff) {
                isHandoff = true;
                parsedResult = parsed;
            }
        } catch (e) {
            // Not a JSON string, which means it's normal text output. No handoff intercepted.
        }

        if (isHandoff) {
            console.log(`[Workflow] Handoff intercepted! Routing from ${currentAgentId} to ${parsedResult.target_agent}`);
            
            // Log the handoff trace
            history.push({ 
                from: currentAgentId, 
                to: parsedResult.target_agent, 
                payload: parsedResult.payload 
            });
            
            // Update state for the next iteration in the loop
            currentAgentId = parsedResult.target_agent;
            
            // Inject the handoff payload into the messages array
            const nextMessages = [...(initialPayload.messages || [])];
            nextMessages.push(new HumanMessage(`[Handoff Instruction]: ${parsedResult.payload}`));
            
            currentPayload = {
                messages: nextMessages
            };
            continue; 
        } else {
            // No handoff was triggered; this agent provided a final answer
            console.log(`[Workflow] Workflow finished by ${currentAgentId}.`);
            return {
                final_answer: result,
                history: history,
                last_agent: currentAgentId
            };
        }
    }
    
    throw new Error("Workflow exceeded maximum steps due to too many handoffs (Possible infinite loop).");
}

/**
 * 1. CREATE HANDOFF TOOLS
 * Hum handoff tools banayenge jo agents ek dusre ko pass karne ke liye use karenge.
 */



// Specialist agents ke liye tool (taaki wo apna kaam khatam karke wapas Supervisor ko control de sakein)
export const handoffToSupervisor = createHandoffTool("supervisor", "Return control to the Supervisor after you have finished your specific task or if you need further instructions.");




// Supervisor ke liye tools (Supervisor baaki sab ko task dega)
export const handoffToCoding = createHandoffTool("coding", "Pass coding and debugging tasks to the Coding Agent.");
export const handoffToExecuter = createHandoffTool("executer", "Pass execution and testing tasks to the Executer Agent.");
export const handoffToPlanner = createHandoffTool("planner", "Pass complex requests to the Planner Agent to break down into steps.");
export const handoffToResearch = createHandoffTool("research", "Pass factual queries and search tasks to the Research Agent.");
export const handoffToWriting = createHandoffTool("writing", "Pass drafting and formatting tasks to the Writing Agent.");
