import React, { createContext, useState, useEffect, type ReactNode } from "react";

export interface Message {
  id: string;
  sender: "user" | "ai";
  content: any;
  timestamp: Date;
}

export interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "amanova_chat_history";

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize messages from localStorage if present
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      }
    } catch (e) {
      console.error("Failed to load chat history from localStorage", e);
    }
    return [];
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error("Failed to save chat history to localStorage", e);
    }
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};