import { useContext } from "react";
import { ChatContext, type Message } from "../chatContext.tsx";
import { fetchResponse } from "../api/chat.api.ts";

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }

  const { messages, setMessages, loading, setLoading, error, setError } = context;

  const sendMessage = async (prompt: string) => {
    if (!prompt.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: prompt,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      const data = await fetchResponse(prompt);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        content: data,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error("Failed to send message:", err);
      setError(err.message || "Something went wrong while executing AI graph");
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
  };
};
