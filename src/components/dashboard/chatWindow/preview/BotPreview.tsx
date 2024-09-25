import React from "react";
import Bubble from "../bubble";
import { TooltipC } from "@/components/tooltip";
import { useCustomizeContext } from "@/context/use-customize-context";
import ChatInput from "./inputPreview";
import { watch } from "fs";
import { useCustomizeThemeContext } from "@/context/use-theme-context";

const BotPreview = () => {
  const { chatbot, watch } = useCustomizeContext();
  const theme = watch("theme");
  const { theme: chatbotTheme } = useCustomizeThemeContext();
  return (
    <div className="relative h-[calc(100vh-9rem)]  flex divide-y divide-zinc-200 flex-col justify-between gap-2">
      {" "}
      <div className="flex-1 flex-grow px-3  overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
        <Bubble
          message={{
            role: "assistant",
            content: chatbot?.initialMessage ?? "",
          }}
          style={
            theme === "customize"
              ? {
                  color: chatbotTheme?.botMessageTextColor,
                  background:chatbotTheme?.botMessageBackground
                }
              : {}
          }
        />
        <TooltipC suggestQ={chatbot?.suggestQ ?? []} />
      </div>
      <ChatInput />
    </div>
  );
};

export default BotPreview;
