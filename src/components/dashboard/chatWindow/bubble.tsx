import React from "react";
import { cn, extractUUIDFromString, getMonthName } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import dayjs from "dayjs";
import { ChatbotType } from "@/hooks/chatbot/use-chatbot";
import ReactMarkdown from "react-markdown";

type Props = {
  message: {
    role: "assistant" | "user";
    content: string;
    isImage?: boolean;
  };
  createdAt?: Date;
  // eslint-disable-next-line
  style?: any;
  chatbot?: ChatbotType;
};

const Bubble = ({ message, createdAt, style, chatbot }: Props) => {
  return (
    <div
      className={cn("flex items-end p-2 my-2 ", {
        "justify-end": message.role !== "assistant",
      })}
    >
      <div
        className={cn(
          "relative flex h-6 w-6 aspect-square items-center justify-center bg-transparent",
          {
            "order-2 rounded-sm": message.role !== "assistant",
            "order-1  rounded-sm": message.role === "assistant",
          }
        )}
      >
        {message.role === "assistant" ? (
          <Avatar className="w-5 h-5 ">
            <AvatarFallback>
              <Bot
                className={cn(
                  "h-5 w-5  text-zinc-800 bg-transparent border-none",
                  {
                    "text-white bg-black": chatbot?.theme === "dark",
                  }
                )}
              />
            </AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="w-5 h-5 ">
            <AvatarFallback>
              <User
                className={cn(
                  "h-5 w-5  text-zinc-800 bg-transparent border-none",
                  {
                    "text-white bg-black": chatbot?.theme === "dark",
                  }
                )}
              />
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      <div
        className={cn(
          "flex flex-col space-y-2 text-base max-w-md mx-2 w-full break-words",
          {
            "order-1 items-end": message.role !== "assistant",
            "order-2 items-start": message.role === "assistant",
          }
        )}
      >
        <div
          className={cn(
            "px-4 py-2 rounded-lg inline-block max-w-[80%] w-full",
            {
              "bg-[#06b6d4] text-white": message.role !== "assistant",
              "bg-muted text-gray-900": message.role === "assistant",
              "rounded-br-none": message.role !== "assistant",
              "rounded-bl-none": message.role === "assistant",
            }
          )}
          style={style}
        >
          {message.isImage ? (
            <div className="relative aspect-square max-w-[90%] w-full">
              {" "}
              {/* Image width constraint */}
              <Image src={`${message.content}`} fill alt="image" />
            </div>
          ) : (
            <ReactMarkdown
              className={cn("prose", "text-sm break-words")}
              components={{
                a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />
              }}
            >
              {message.content.replace("(complete)", " ")}
            </ReactMarkdown>
          )}

          {createdAt ? (
            <div className="text-xs select-none mt-2 w-full text-right">
              <p>{dayjs(createdAt).format("HH:mm")}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Bubble;
