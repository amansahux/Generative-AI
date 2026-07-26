import { HumanMessage } from "@langchain/core/messages";
import { StateSchema, MessagesValue, StateGraph, START, END, ReducedValue, type GraphNode } from "@langchain/langgraph";
import * as z from "zod"
import { cohereModel, geminiModel, mistralModel } from "./ai.service.js";

const JudgeSchema = z.object({
    solution_1_score: z.number().min(0).max(10),
    solution_2_score: z.number().min(0).max(10),
    judge_recommendation: z.string()
});

const State = new StateSchema({
    messages: MessagesValue,
    solution_1: new ReducedValue(z.string().default(""), {
        reducer: (current, next) => { return next }
    }),
    solution_2: new ReducedValue(z.string().default(""), {
        reducer: (current, next) => { return next }
    }),
    judge_recommendation: new ReducedValue(
        JudgeSchema.default({
            solution_1_score: 0,
            solution_2_score: 0,
            judge_recommendation: ""
        }), 
        { reducer: (current, next) => { return next } }
    )
});

const solutionNode: GraphNode<typeof State.State> = async (state) => {
    console.log("solution node in progress")
    console.log(state)
    const userPrompt = state.messages[0]?.text || String(state.messages[0]?.content || "");
   try {
        const [cohere, mistral] = await Promise.all([
            cohereModel.invoke(userPrompt),
            mistralModel.invoke(userPrompt)
        ]);

        return {
            solution_1: cohere.text,
            solution_2: mistral.text
        }

    } catch (err) {

        return {
            solution_1: "Cohere Failed",
            solution_2: "Mistral Failed"
        }
    }
}

const judgeNode: GraphNode<typeof State.State> = async (state) => {
    console.log("judge Node in progress")
    console.log(state)
    const { solution_1, solution_2 } = state;
    const structuredJudge = geminiModel.withStructuredOutput(JudgeSchema);
    
    const result = await structuredJudge.invoke([
        new HumanMessage(`
You are an expert code reviewer and judge in an AI Code Battle Arena.

Problem Statement:
${state.messages[0]?.text ?? "N/A"}

Compare the following two solutions based on correctness, efficiency (time and space complexity), code readability, and edge-case handling.

--- SOLUTION 1 ---
${solution_1}

--- SOLUTION 2 ---
${solution_2}

Instructions:
- Evaluate both solutions thoroughly.
- Rate Solution 1 from 0 to 10.
- Rate Solution 2 from 0 to 10.
- CRITICAL: Do NOT give the exact same score to both solutions. Identify key differences in performance, readability, or edge cases to rank one higher than the other.
- Provide a clear judge recommendation highlighting key strengths, weaknesses, and which solution wins.
        `)
    ]);

    return {
        judge_recommendation: result
    }
}

const graph = new StateGraph(State).addNode("solution", solutionNode).addNode("judge", judgeNode).addEdge(START, "solution").addEdge("solution", "judge").addEdge("judge", END).compile();

export default async function (userMessage: string) {
    const res = await graph.invoke({
        messages: [new HumanMessage(userMessage)]
    })
    console.log(res)
    return res.messages
}


