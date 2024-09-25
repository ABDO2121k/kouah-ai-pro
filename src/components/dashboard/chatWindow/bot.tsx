import React from "react";
import Bubble from "./bubble";
import { ThemeType } from "@/actions/customize";
import { ChatbotType, useChatbot } from "@/hooks/chatbot/use-chatbot";
import { Responding } from "./responding";
import { SuggestedQ } from "@/components/tooltip/SuggestedQ";
import ChatInput from "./ChatInput";

const Bot = ({
  theme,
  chatbot,
  onAiTyping,
  onChats,
  onStartChatting,
  register,
}: {
  theme: ThemeType;
  chatbot: ChatbotType;
  onAiTyping: boolean;
  onChats: ReturnType<typeof useChatbot>["onChats"];
  onStartChatting: ReturnType<typeof useChatbot>["onStartChatting"];
  register: ReturnType<typeof useChatbot>["register"];
}) => {
  return (
    <div className="relative h-[calc(100vh-9rem)] flex flex-col gap-2 ">

      <div className="flex-grow overflow-y-auto overflow-x-hidden px-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
        <Bubble
          message={{
            role: "assistant",
            content: chatbot?.initialMessage ?? "",
          }}
          style={
            chatbot?.theme === "customize"
              ? {
                  color: theme?.botMessageTextColor,
                  background: theme?.botMessageBackground,
                }
              : {}
          }
        />
        <SuggestedQ suggestQ={chatbot?.suggestQ ?? []} />
        {onChats.slice(1).map((chat, key) => (
          <Bubble key={key} message={chat} />
        ))}
        {onAiTyping && <Responding />}
      </div>
      <div className="h-auto border-t pt-1">
        <ChatInput
          theme={theme}
          chatbot={chatbot}
          onAiTyping={onAiTyping}
          onStartChatting={onStartChatting}
          register={register}
        />
      </div>
    </div>
  );
};

export default Bot;
