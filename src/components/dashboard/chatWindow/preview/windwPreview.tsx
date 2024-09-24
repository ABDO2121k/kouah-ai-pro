"use client";
import React from "react";
import { BOT_TABS_MENU } from "@/constants/menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import TabsMenu from "@/components/tabs";
import { TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useCustomizeContext } from "@/context/use-customize-context";
import BotPreview from "./BotPreview";
import HelpDiskPreview from "./HelpDiskPreview";
import { useCustomizeThemeContext } from "@/context/use-theme-context";

//eslint-deisable-next-line
const WindowPreview = () => {
  const { chatbot, watch } = useCustomizeContext();
  const theme = watch("theme");
  const { theme: chatbotTheme } = useCustomizeThemeContext();
  return (
    <div
      className={cn(
        "h-full w-full flex flex-col bg-zinc-50 rounded-xl mr-[80px] border-[1px]",
        {
          "bg-black": theme == "dark",
          [`bg-[${chatbotTheme?.containerBackground ?? "#ffffff"}]`]:
            theme === "customize",
        }
      )}
    >
      <div
        className={cn(
          "flex justify-between px-4 pt-4 mb-2 divide-zinc-400 border-b",
          {
            "py-7": !chatbot?.isHelpDisk,
          }
        )}
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
              "text-zinc-50": theme == "dark",
            })}
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
        >
          <TabsContent value="chat">
            <Separator orientation="horizontal" />
            <BotPreview />
          </TabsContent>
          <TabsContent value="helpdesk">
            <HelpDiskPreview />
          </TabsContent>
        </TabsMenu>
      ) : (
        <BotPreview />
      )}
      <div className="flex justify-center">
        <p className="text-gray-400 text-xs">Powered By Web Kouah AI</p>
      </div>
    </div>
  );
};

export default WindowPreview;
