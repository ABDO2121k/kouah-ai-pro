"use client";

import { useChatbots } from "@/hooks/chatbots/use-chatbots";
import { createContext, useContext, useEffect, useMemo } from "react";

type ChatContextType = ReturnType<typeof useChatbots>;

const initialChatContextValue: ChatContextType = {
  loading: false,
  chatbots: [],
  selectedChatbot: "",
  setSelectedChatbot: () => {},
  deletechatbot: async () => {},
  currentlyDeleting: "",
  setCurrentlyDeleting: () => {},
  setActions: () => {},
  actions: 0,
};

//eslint-disable-next-line
const ChatContext = createContext<ChatContextType>(initialChatContextValue);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    loading,
    chatbots,
    selectedChatbot,
    setSelectedChatbot,
    deletechatbot,
    currentlyDeleting,
    setCurrentlyDeleting,
    setActions,
    actions,
  } = useChatbots();

  useEffect(() => {
    if (selectedChatbot)
      localStorage.setItem("selectedChatbot", selectedChatbot);
  }, [selectedChatbot]);

  const values = useMemo(
    () => ({
      loading,
      chatbots,
      selectedChatbot,
      setSelectedChatbot,
      deletechatbot,
      currentlyDeleting,
      setCurrentlyDeleting,
      setActions,
      actions,
    }),
    [
      loading,
      chatbots,
      selectedChatbot,
      deletechatbot,
      currentlyDeleting,
      setActions,
      actions,
    ]
  );

  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => useContext(ChatContext);
