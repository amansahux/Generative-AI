import React, { createContext, useState, type ReactNode } from "react";

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

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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