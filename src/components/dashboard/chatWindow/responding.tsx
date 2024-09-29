import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Bot } from "lucide-react";
import React from "react";

export const Responding = ({ theme }: { theme: string }) => {
  return (
    <div className="self-start flex items-end gap-3">
      <Avatar className="w-5 h-5 ">
        <AvatarFallback>
          <Bot
            className={cn("h-5 w-5  text-zinc-800 bg-transparent border-none", {
              "text-white bg-black": theme === "dark",
            })}
          />
        </AvatarFallback>
      </Avatar>
      <div className="chat-bubble">
        <div className="typing">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
};
