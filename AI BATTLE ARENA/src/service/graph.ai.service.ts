import { HumanMessage } from "@langchain/core/messages";
import { StateSchema, MessagesValue, StateGraph, START, END, ReducedValue } from "@langchain/langgraph";
import type { GraphNode } from "@langchain/langgraph";
import * as z from "zod"
import { cohereModel, mistralModel } from "./ai.service.js";

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
const solutionNode: GraphNode<typeof State.State> = async(state) => {
    const [cohere_solution , mistral_solution] = await Promise.all([
        cohereModel.invoke(state.messages),
        mistralModel.invoke(state.messages)
    ])
    return {
        messages: state.messages,
        solution_1: cohere_solution.text,
        solution_2: mistral_solution.text,
    }
}

const graph = new StateGraph(State).addNode("solution", solutionNode).addEdge(START, "solution").addEdge("solution", END).compile()

export default async function (userMessage: string) {
    const res = await graph.invoke({
        messages: [new HumanMessage(userMessage)]
    })
    console.log(res)
    return res.messages
}


