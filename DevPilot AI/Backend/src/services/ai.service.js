import { createChatChain } from "../ai/chains/chat.chain";
import { mistralModel } from "../ai/model";

const Chain = await createChatChain(mistralModel)
const res = await Chain.invoke([
  {
    "_id": "6890d12f1234567890abcdef",
    "sessionId": "6890d1001234567890abcd11",
    "role": "system",
    "content": "You are Amanova AI, a helpful AI assistant.",
    "createdAt": "2026-08-03T10:00:00Z"
  },
  {
    "_id": "6890d1301234567890abcdf0",
    "sessionId": "6890d1001234567890abcd11",
    "role": "user",
    "content": "Hi, who are you?",
    "createdAt": "2026-08-03T10:00:05Z"
  },
  {
    "_id": "6890d1311234567890abcdf1",
    "sessionId": "6890d1001234567890abcd11",
    "role": "assistant",
    "content": "I'm Amanova AI. How can I help you today?",
    "createdAt": "2026-08-03T10:00:08Z"
  },
  {
    "_id": "6890d1321234567890abcdf2",
    "sessionId": "6890d1001234567890abcd11",
    "role": "user",
    "content": "Explain what LangChain is under 100 tokens/words",
    "createdAt": "2026-08-03T10:00:15Z"
  }
])