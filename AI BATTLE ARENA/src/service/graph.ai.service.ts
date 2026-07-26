import { HumanMessage } from "@langchain/core/messages";
import { StateSchema, MessagesValue, StateGraph, START, END, ReducedValue, type GraphNode } from "@langchain/langgraph";
import * as z from "zod"
import { cohereModel, geminiModel, mistralModel } from "./ai.service.js";
import { createAgent, ProviderStrategy, providerStrategy } from "langchain"

const State = new StateSchema({
    messages: MessagesValue,
    solution_1: new ReducedValue(z.string().default(""), {
        reducer: (current, next) => { return next }
    }),
    solution_2: new ReducedValue(z.string().default(""), {
        reducer: (current, next) => { return next }
    }),
    judge_recommendation: new ReducedValue(z.object().default({
        solution_1_score: 0,
        solution_2_score: 0,
    }), { reducer: (current, next) => { return next } })
});
const solutionNode: GraphNode<typeof State.State> = async (state) => {
    const [cohere_solution, mistral_solution] = await Promise.all([
        cohereModel.invoke(state.messages[0].text),
        mistralModel.invoke(state.messages[0].text)
    ])
    return {
        messages: state.messages,
        solution_1: cohere_solution.text,
        solution_2: mistral_solution.text,
    }
}
const judgeNode: GraphNode<typeof State.State> = async (state) => {
    const { solution_1, solution_2 } = state
    const Judge = createAgent({
        model: geminiModel,
        tools: [],
        responseFormat: providerStrategy(z.object({
            solution_1_score: z.number().min(0).max(10),
            solution_2_score: z.number().min(0).max(10),
        }))
    })
}

const graph = new StateGraph(State).addNode("solution", solutionNode).addNode("judge", judgeNode).addEdge(START, "solution").addEdge("solution", "judge").addEdge("judge", END).compile();

export default async function (userMessage: string) {
    const res = await graph.invoke({
        messages: [new HumanMessage(userMessage)]
    })
    console.log(res)
    return res.messages
}


