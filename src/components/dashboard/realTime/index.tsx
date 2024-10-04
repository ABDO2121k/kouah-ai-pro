"use client"
import { Separator } from "@/components/ui/separator";
import React from "react";
import ConversationMenu from "./ConversationMenu";
import { useChatContext } from "@/context/use-chatbot-context";
import { useGetChatbot } from "@/hooks/chatbot/use-chatbot";



  
const RealTime = () => {
    const {chatbot}=useGetChatbot()
  return (
    <div className="w-full h-full flex">
      <ConversationMenu chatRooms={chatbot?.ChatRoom} />
      <Separator orientation="vertical" />
      <div className="w-full h-full flex flex-col">
        <div className="px-5">
          {/* <InfoBar /> */}
        </div>
        {/* <Mesenger /> */}
      </div>
    </div>
  );
};

export default RealTime;
