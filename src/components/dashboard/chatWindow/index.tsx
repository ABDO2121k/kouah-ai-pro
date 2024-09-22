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
import Accordion from "@/components/accordion/Accordion";
import { useElementSize } from "@mantine/hooks";
import { useChatbot } from "@/hooks/chatbot/use-chatbot";

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
  } = useChatbot(chatbotId);
  return (
    <div className="h-full w-full flex flex-col bg-white rounded-xl mr-[80px] border-[1px]">
      <div className="flex justify-between px-4 pt-4">
        <div className="flex gap-2">
          <Avatar className="w-10 h-10">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-start flex-col">
            <h3 className="text-lg font-bold leading-none">
              Sales Rep - Web Prodigies
            </h3>
            <p className="text-sm">{"hello"}</p>
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
      <TabsMenu
        triggers={BOT_TABS_MENU}
        className="bg-transparent border-[1px] border-border max-w-full"
      >
        <TabsContent value="chat">
          <Separator orientation="horizontal" />
          <div className="flex flex-col h-[calc(100vh-9rem)]">
            {" "}
            {/* Adjust this value as needed */}
            <div
              className="flex-grow px-3 py-5 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
              ref={messageWindowRef}
            >
              {onChats.map((chat, key) => (
                <Bubble key={key} message={chat} />
              ))}
              {onAiTyping && <Responding />}
            </div>
            <form
              onSubmit={onStartChatting}
              className="flex px-3 py-1 flex-col flex-shrink-0 bg-porcelain"
            >
              <div className="flex justify-between">
                <Input
                  {...register("content")}
                  placeholder="Type your message..."
                  className="focus-visible:ring-0 flex-1 p-0 focus-visible:ring-offset-0 bg-porcelain rounded-none outline-none border-none"
                />
                <Button type="submit" className="mt-3">
                  <Send />
                </Button>
              </div>
              <Label htmlFor="bot-image">
                <Paperclip />
                <Input
                  {...register("image")}
                  type="file"
                  id="bot-image"
                  className="hidden"
                />
              </Label>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="helpdesk">
          <div className="h-[calc(100vh-9rem)] overflow-y-auto overflow-x-hidden p-4 flex flex-col gap-4 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
            <div>
              <CardTitle>Help Desk</CardTitle>
              <CardDescription>
                Browse from a list of questions people usually ask.
              </CardDescription>
            </div>
            <Separator orientation="horizontal" />
            {chatbot?.HelpDesk?.map((desk) => (
              <Accordion
                key={desk.id}
                trigger={desk.question}
                content={desk.answer}
              />
            ))}
          </div>
        </TabsContent>
      </TabsMenu>
      <div className="flex justify-center">
        <p className="text-gray-400 text-xs">Powered By Web Prodigies</p>
      </div>
    </div>
  );
};

export default ChatWindow;
