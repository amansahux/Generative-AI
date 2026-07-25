import { HumanMessage } from "@langchain/core/messages";
import { StateSchema, MessagesValue, StateGraph, START, END } from "@langchain/langgraph";
import type { GraphNode } from "@langchain/langgraph";


const State = new StateSchema({
    messages: MessagesValue,
});
const solutionNode: GraphNode<typeof State.State> = (state) => {
    console.log(state.messages)
    return {
        messages: state.messages
    }
}

const graph = new StateGraph(State).addNode("solution", solutionNode).addEdge(START, "solution").compile()

export default async function (userMessage:string) {
    const res = await graph.invoke({
        messages:[new HumanMessage(userMessage)]
    })
    console.log(res)
    return res.messages
    
}


