"use client";
import React from "react";
import Bubble from "./bubble";
import { BOT_TABS_MENU } from "@/constants/menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import TabsMenu from "@/components/tabs";
import { TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Send } from "lucide-react";
import { Label } from "@/components/ui/label";
import { CardDescription, CardTitle } from "@/components/ui/card";
import Accordion from "@/components/accordion/Accordion";
import { cn } from "@/lib/utils";
import { useCustomizeContext } from "@/context/use-customize-context";
import { TooltipC } from "@/components/tooltip";

//eslint-deisable-next-line
const WindowPreview = () => {
  const { chatbot } = useCustomizeContext();
  return (
    <div className="h-full w-full flex flex-col bg-white rounded-xl mr-[80px] border-[1px]">
      <div
        className={cn("flex justify-between px-4 pt-4 mb-2", {
          "py-7": !chatbot?.isHelpDisk,
        })}
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
          <div className="flex items-center flex-col">
            <h3 className="text-lg font-bold leading-none">{chatbot?.title}</h3>
            <p className="text-sm">{chatbot?.subTitle}</p>
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
        >
          <TabsContent value="chat">
            <Separator orientation="horizontal" />
            <div className="flex flex-col h-[calc(100vh-9rem)]">
              {" "}
              {/* Adjust this value as needed */}
              <div className="flex-grow px-3 py-5 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
                <Bubble
                  message={{
                    role: "assistant",
                    content: chatbot?.initialMessage ?? "",
                  }}
                />
                <TooltipC suggestQ={chatbot?.suggestQ ?? []} />
              </div>
              <div className="flex px-3 py-1 flex-col flex-shrink-0 bg-porcelain">
                <div className="flex justify-between">
                  <Input
                    placeholder={chatbot?.placeHolder}
                    className="focus-visible:ring-0 flex-1 p-0 focus-visible:ring-offset-0 bg-porcelain rounded-none outline-none border-none"
                  />
                  <Button type="submit" className="mt-3">
                    <Send />
                  </Button>
                </div>
                <Label htmlFor="bot-image">
                  <Paperclip />
                  <Input type="file" id="bot-image" className="hidden" />
                </Label>
              </div>
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
              {/* eslint-disable-next-line */}
              {chatbot?.HelpDesk?.map((desk: any) => (
                <Accordion
                  key={desk?.id}
                  trigger={desk?.question}
                  content={desk?.answer}
                />
              ))}
            </div>
          </TabsContent>
        </TabsMenu>
      ) : (
        <div className="flex flex-col h-[calc(100vh-9rem)] border-[1px] border-border max-w-full">
          {" "}
          <div className="flex-grow px-3 py-5 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
            <Bubble
              message={{
                role: "assistant",
                content: chatbot?.initialMessage ?? "",
              }}
            />
            <TooltipC suggestQ={chatbot?.suggestQ ?? []} />
          </div>
          <div className="flex px-3 py-1 flex-col flex-shrink-0 bg-porcelain">
            <div className="flex justify-between">
              <Input
                placeholder={chatbot?.placeHolder}
                className="focus-visible:ring-0 flex-1 p-0 focus-visible:ring-offset-0 bg-porcelain rounded-none outline-none border-none"
              />
              <Button type="submit" className="mt-3">
                <Send />
              </Button>
            </div>
            <Label htmlFor="bot-image">
              <Paperclip />
              <Input type="file" id="bot-image" className="hidden" />
            </Label>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <p className="text-gray-400 text-xs">Powered By Web Kouah AI</p>
      </div>
    </div>
  );
};

export default WindowPreview;
