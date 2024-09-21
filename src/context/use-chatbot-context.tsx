"use client";

import { useChatbots } from "@/hooks/chatbots/use-chatbots";
import { createContext, useContext, useEffect, useState } from "react";
// import { Message, useChat } from "ai/react";

type ChatContextType = ReturnType<typeof useChatbots>;
const initialChatContextValue: ChatContextType = {
  loading: false,
  chatbots: [],
  selectedChatbot: "",
  setSelectedChatbot: () => {},
  deletechatbot: async () => {},
  currentlyDeleting: "",
  setCurrentlyDeleting: () => {},
};

//eslint-disable-next-line
const ChatContext = createContext<ChatContextType>(initialChatContextValue);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  //eslint-disable-next-line
  const [chatbot, setChatbot] = useState<any>(null);
  // const { messages, handleInputChange, handleSubmit, input, setInput } =
  //   useChat({
  //     api: "/api/chat-stream"
  //   });
  const {
    loading,
    chatbots,
    selectedChatbot,
    setSelectedChatbot,
    deletechatbot,
    currentlyDeleting,
    setCurrentlyDeleting,
  } = useChatbots();

  useEffect(() => {
    if (chatbots.length > 0&&selectedChatbot)
      setChatbot(chatbots.find((bot) => bot.id === selectedChatbot));
  }, [chatbots, selectedChatbot]);

  const values = {
    loading,
    chatbots,
    selectedChatbot,
    setSelectedChatbot,
    deletechatbot,
    currentlyDeleting,
    chatbot,
    setCurrentlyDeleting,
  };

  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => useContext(ChatContext);
