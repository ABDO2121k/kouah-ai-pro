"use client";
import React from "react";
import RealTimeMode from "./real-time";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import TabsMenu from "@/components/tabs";
import { TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Responding } from "./responding";
import { Input } from "@/components/ui/input";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, Paperclip, RefreshCcw, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BOT_TABS_MENU } from "@/constants/menu";
import Bubble from "./bubble";
import { useChatbot } from "@/hooks/chatbot/use-chatbot";
import { cn } from "@/lib/utils";
import HelpDisk from "./HelpDisk";
import Bot from "./bot";

const ChatWindow = ({ chatbotId }: { chatbotId: string }) => {
  const {
    // onOpenChatBot,
    // botOpened,
    onChats,
    register,
    onStartChatting,
    onAiTyping,
    // messageWindowRef,
    chatbot,
    // loading,
    // onRealTime,
    // setOnChats,
    // errors,
    messageWindowRef,
    theme,
  } = useChatbot(chatbotId);
  return (
    <div
      className={cn(
        "h-full w-full flex flex-col bg-zinc-50 rounded-xl mr-[80px] border-[1px]",
        {
          "bg-black": chatbot?.theme == "dark",
        }
      )}
      style={
        chatbot?.theme === "customize"
          ? {
              background: theme?.containerBackground,
              borderColor: theme?.borderColor,
            }
          : {}
      }
    >
      <div
        className={cn(
          "flex justify-between px-4 pt-4 mb-2 divide-zinc-400 border-b",
          {
            "py-7": !chatbot?.isHelpDisk,
          }
        )}
        style={
          chatbot?.theme === "customize"
            ? {
                borderColor: theme?.borderColor,
              }
            : {}
        }
      >
        <div className="flex gap-2">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={
                chatbot?.logo ? chatbot?.logo : "https://github.com/shadcn.png"
              }
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div
            className={cn("flex items-center flex-col justify-center mb-2", {
              "text-zinc-50": chatbot?.theme == "dark",
            })}
            style={
              chatbot?.theme === "customize"
                ? {
                    color: theme?.textColor,
                  }
                : {}
            }
          >
            <h3 className="text-lg font-bold leading-none text-center my-auto">
              {chatbot?.title}
            </h3>
            <p className="text-sm text-center my-auto">{chatbot?.subTitle}</p>
          </div>
        </div>
        <div className="relative w-10 h-10">
          <Image
            src="https://ucarecdn.com/019dd17d-b69b-4dea-a16b-60e0f25de1e9/propuser.png"
            fill
            alt="users"
            objectFit="contain"
          />
        </div>
      </div>
      {chatbot?.isHelpDisk ? (
        <TabsMenu
          triggers={BOT_TABS_MENU}
          className="bg-transparent border-[1px] border-border max-w-full"
          style={
            chatbot?.theme === "customize"
              ? {
                  borderColor: theme?.borderColor,
                }
              : {}
          }
        >
          <TabsContent value="chat">
            <Separator orientation="horizontal" />
            <Bot
              theme={theme}
              chatbot={chatbot}
              onAiTyping={onAiTyping}
              onChats={onChats}
              onStartChatting={onStartChatting}
              register={register}
            />
          </TabsContent>

          <TabsContent value="helpdesk">
            <HelpDisk chatbot={chatbot} />
          </TabsContent>
        </TabsMenu>
      ) : (
        <Bot
          theme={theme}
          chatbot={chatbot}
          onAiTyping={onAiTyping}
          onChats={onChats}
          onStartChatting={onStartChatting}
          register={register}
        />
      )}

      <div className="flex justify-center">
        <p className="text-gray-400 text-xs">Powered By Web Kouah AI</p>
      </div>
    </div>
  );
};

export default ChatWindow;
