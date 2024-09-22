"use client";
import CopyButton from "@/components/dashboard/copyButton";
import { useChatContext } from "@/context/use-chatbot-context";
import { useGetChatbot } from "@/hooks/chatbot/use-chatbot";
import React from "react";

const HI = () => {
  const { selectedChatbot } = useChatContext();
  const { chatbot } = useGetChatbot();

  return (
    <div className="grid grid-cols-5 overflow-y-auto h-[calc(100vh-3.5rem)] ">
      <div className="col-span-5 md:col-span-5 lg:col-span-4 h-[calc(screen-3.5rem-10rem)] md:h-[70%] lg:h-[30rem]  p-5 ">
        <iframe
          src={`/embed/${selectedChatbot}`}
          className="h-full w-full rounded-md shadow-lg overflow-none"
        />
      </div>
      <div className="col-span-1 hidden sm:flex w-full  p-5 mt-10  flex-col gap-5">
        <div className="flex flex-col gap-1">
          <span className="text-zinc-500 font-bold">Name :</span>
          <span className="text-zinc-800 font-bold">{chatbot?.title}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-zinc-500 font-bold">Description :</span>
          <span className="text-zinc-800 font-bold">
            {chatbot?.description ? chatbot?.description : "No Description"}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-zinc-500 font-bold">ID :</span>
          <CopyButton chatbotId={chatbot?.id} />
        </div>
      </div>
    </div>
  );
};

export default HI;
