"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Bot } from "lucide-react";
import Image from "next/image";
import { useChatContext } from "@/context/use-chatbot-context";
import { useGetChatbot } from "@/hooks/chatbot/use-chatbot";

interface AccountSwitcherProps {
  isCollapsed: boolean;
}

export function AccountSwitcher({ isCollapsed }: AccountSwitcherProps) {
  const { selectedChatbot, chatbots, setSelectedChatbot } = useChatContext();
  const { chatbot } = useGetChatbot();
  return (
    <>
      {" "}
      {selectedChatbot && (
        <Select
          defaultValue={selectedChatbot}
          onValueChange={setSelectedChatbot}
        >
          <SelectTrigger
            className={cn(
              "flex items-center gap-2 [&>span]:line-clamp-1 z-2 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
              isCollapsed &&
                "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
            )}
            aria-label="Select chatbot"
          >
            <SelectValue placeholder="Select a  chatbot">
              <Bot className="h-5 w-5" />
              <span className={cn("ml-2", isCollapsed && "hidden")}>
                {chatbot?.title != "Your chatbot title"
                  ? chatbot?.title
                  : chatbot?.id}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {chatbots.map((chatbotE) => (
              <SelectItem key={chatbotE.id} value={chatbotE.id}>
                <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
                  <Bot className="h-5 w-5" />
                  {chatbotE?.title != "Your chatbot title"
                    ? chatbotE?.title
                    : chatbotE?.id}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </>
  );
}
