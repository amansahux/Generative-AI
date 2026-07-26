import { useContext } from "react";
import type { ChatContextType } from "../chatContext.tsx";
import { ChatContext } from "../chatContext.tsx";
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
