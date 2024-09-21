"use client";
import ChatWindow from "@/components/dashboard/chatWindow";
import { useChatContext } from "@/context/use-chatbot-context";
import React from "react";

const HI = () => {
  const { selectedChatbot } = useChatContext();

  return (
    <div className="grid grid-cols-3 overflow-y-auto h-[calc(100vh-3.5rem)] ">
      <div className="col-span-3 md:col-span-3 lg:col-span-2 h-[calc(100vh-3.5rem)] md:h-[80%] lg:h-[30rem]  p-5 ">
        <iframe
          src={`http://localhost:3000/embed/${selectedChatbot}`}
          className="h-full w-full rounded-md shadow-lg overflow-none"
        />
      </div>
    </div>
  );
};

export default HI;
