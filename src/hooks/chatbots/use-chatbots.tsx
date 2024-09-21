"use client";

import { deleteChatbot, getAccountChatBots } from "@/actions/chatbot";
import { useEffect, useState } from "react";
import { toast } from "../use-toast";

type ChatBotsResponse = Awaited<ReturnType<typeof getAccountChatBots>>;

export const useChatbots = () => {
  const [loading, setLoading] = useState(false);
  const [chatbots, setChatbots] = useState<ChatBotsResponse | []>([]);
  const [selectedChatbot, setSelectedChatbot] = useState("");
  const [currentlyDeleting, setCurrentlyDeleting] = useState("");
  const [prevSelected, setPrevSelected] = useState("");

  const getAllChatbots = async () => {
    const chatbotsV = await getAccountChatBots();
    setChatbots(chatbotsV);
  };

  useEffect(() => {
    setLoading(true);
    getAllChatbots().then(() => {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    });
  }, [currentlyDeleting]);

  const deletechatbot = async (chatbotId: string) => {
    setCurrentlyDeleting(chatbotId);
    const resp = await deleteChatbot(chatbotId);
    setCurrentlyDeleting("");

    toast({
      title: resp.status !== 200 ? "Error" : "Success",
      description: resp.message,
      variant: resp.status !== 200 ? "destructive" : "default",
    });
  };

  useEffect(() => {
    if (
      chatbots?.length > 0 &&
      !selectedChatbot &&
      !prevSelected &&
      (selectedChatbot != prevSelected || (!selectedChatbot && !prevSelected))
    ) {
      setSelectedChatbot(chatbots[0].id);
      setPrevSelected(selectedChatbot);
    }
  }, [chatbots, selectedChatbot]);

  return {
    loading,
    chatbots,
    selectedChatbot,
    setSelectedChatbot,
    deletechatbot,
    currentlyDeleting,
    setCurrentlyDeleting,
  };
};
