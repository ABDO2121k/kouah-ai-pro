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

interface AccountSwitcherProps {
  isCollapsed: boolean;
}

export function AccountSwitcher({ isCollapsed }: AccountSwitcherProps) {
  const { selectedChatbot, chatbots, setSelectedChatbot } = useChatContext();
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
            aria-label="Select account"
          >
            <SelectValue placeholder="Select an account">
              {chatbots.find((chatbot) => chatbot.id === selectedChatbot)
                ?.logo ? (
                <Image
                  className="h-5 w-5"
                  src={
                    chatbots.find((chatbot) => chatbot.id === selectedChatbot)
                      ?.logo ?? ""
                  }
                  alt="logo"
                />
              ) : (
                <Bot className="h-5 w-5" />
              )}
              <span className={cn("ml-2", isCollapsed && "hidden")}>
                {chatbots.find((chatbot) => chatbot.id === selectedChatbot)
                  ?.id ?? "null"}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {chatbots.map((chatbot) => (
              <SelectItem key={chatbot.id} value={chatbot.id}>
                <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
                  {chatbot.logo ? (
                    <Image className="h-5 w-5" src={chatbot.logo} alt="logo" />
                  ) : (
                    <Bot className="h-5 w-5" />
                  )}
                  {chatbot.id}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </>
  );
}
