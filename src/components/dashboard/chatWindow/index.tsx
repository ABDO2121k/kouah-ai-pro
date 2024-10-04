"use client";
import React, { useEffect, useState } from "react";
import RealTimeMode from "./real-time";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import TabsMenu from "@/components/tabs";
import { TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { X, History } from "lucide-react";
import { BOT_TABS_MENU } from "@/constants/menu";
import { useChatbot } from "@/hooks/chatbot/use-chatbot";
import { cn } from "@/lib/utils";
import HelpDisk from "./HelpDisk";
import Bot from "./bot";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Loader } from "@/components/loader";
import WouldLiveForm from "./wouldLiveForm";

const ChatWindow = ({ chatbotId }: { chatbotId: string }) => {
  const {
    onChats,
    setOnChats,
    register,
    onStartChatting,
    onAiTyping,
    chatbot,
    loading,
    onRealTime,
    messageWindowRef,
    onSuggestedQuestionClick,
    theme,
    usedSuggestedQuestions,
    wouldLive,
    setWouldLive,
    loadingLive,
    registerEmail,
    handleLiveSubmit,
    openHistory,
    setOpenHistory,
  } = useChatbot(chatbotId);

  const searchParams = useSearchParams();
  const opened = searchParams.get("opened");
  const [isOpen, setIsOpen] = useState(opened == "true" ? true : false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "openChat") {
        setIsOpen(true);
      } else if (event.data === "closeChat") {
        setIsOpen(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleCloseChat = () => {
    window.parent.postMessage("closeChat", "*");
  };

  const handleLiveChatSubmit = (email: string) => {
    // Handle the live chat submission here
    console.log("Live chat requested with email:", email);
    setWouldLive(false); // Hide the dialog after submission
  };

  const toggleHistory = () => {
    setOpenHistory(!openHistory);
  };

  return (
    <div className="h-full w-full bg-zinc-50 border-[1px] rounded-lg flex flex-col items-center overflow-hidden">
      <Loader loading={!loading && chatbot && theme ? false : true}>
        <motion.div
          key={isOpen ? "open" : "closed"}
          className={cn("h-full w-full flex flex-col", {
            "bg-black": chatbot?.theme == "dark",
          })}
          style={
            chatbot?.theme === "customize"
              ? {
                  background: theme?.containerBackground,
                  borderColor: theme?.borderColor,
                }
              : {}
          }
          initial={
            !opened ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }
          }
          animate={
            !opened ? { scale: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0 } : {}
          }
          transition={
            !opened
              ? {
                  type: "spring",
                  stiffness: isOpen ? 260 : 100,
                  damping: isOpen ? 20 : 15,
                  duration: isOpen ? 0.5 : 0.3,
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
            <div className="flex gap-2 items-center">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={
                    chatbot?.logo
                      ? chatbot?.logo
                      : "https://github.com/shadcn.png"
                  }
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div
                className={cn("flex-1 text-left", {
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
                <h3 className="text-lg font-bold leading-none truncate">
                  {chatbot?.title}
                </h3>
                <p className="text-sm truncate">{chatbot?.subTitle}</p>
                {onRealTime?.mode && (
                  <RealTimeMode
                    setChats={setOnChats}
                    chatRoomId={onRealTime.chatroom}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {chatbot?.isRealTimeChat&&!onRealTime?.chatroom && (
                <History
                  className={cn("cursor-pointer h-4 w-4 text-zinc-500 opacity-70", {
                    "text-white": chatbot?.theme === "dark",
                  })}
                  onClick={toggleHistory}
                  style={
                    chatbot?.theme === "customize"
                      ? { color: theme?.textColor }
                      : {}
                  }
                />
              )}
              <div className="relative w-10 h-10">
                {opened !== null ? (
                  <Image
                    src="https://ucarecdn.com/019dd17d-b69b-4dea-a16b-60e0f25de1e9/propuser.png"
                    fill
                    alt="users"
                    objectFit="contain"
                    className="block"
                  />
                ) : (
                  <>
                    <Image
                      src="https://ucarecdn.com/019dd17d-b69b-4dea-a16b-60e0f25de1e9/propuser.png"
                      fill
                      alt="users"
                      objectFit="contain"
                      className="hidden"
                    />
                    <X
                      className={cn("cursor-pointer block", {
                        "text-white": chatbot?.theme === "dark",
                      })}
                      onClick={handleCloseChat}
                      style={
                        chatbot?.theme === "customize"
                          ? { color: theme?.textColor }
                          : {}
                      }
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          {openHistory && chatbot?.isRealTimeChat && (
            <WouldLiveForm
              onSubmit={handleLiveChatSubmit}
              style={
                chatbot?.theme === "customize"
                  ? {
                      color: theme?.primaryTextColor,
                      background: theme?.primaryBackground,
                    }
                  : {}
              }
              style2={
                chatbot?.theme === "customize"
                  ? {
                      background: theme?.containerBackground,
                    }
                  : {}
              }
              loadingLive={loadingLive}
              registerEmail={registerEmail}
              handleLiveSubmit={handleLiveSubmit}
              text={"View Chat History"}
              isHistory={true}
              onCancel={toggleHistory}
            />
          )}
          {wouldLive && chatbot?.isRealTimeChat && (
            <WouldLiveForm
              onSubmit={handleLiveChatSubmit}
              style={
                chatbot?.theme === "customize"
                  ? {
                      color: theme?.primaryTextColor,
                      background: theme?.primaryBackground,
                    }
                  : {}
              }
              style2={
                chatbot?.theme === "customize"
                  ? {
                      background: theme?.containerBackground,
                    }
                  : {}
              }
              loadingLive={loadingLive}
              registerEmail={registerEmail}
              handleLiveSubmit={handleLiveSubmit}
              text={"Start Live Chat"}
            />
          )}
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
                  usedSuggestedQuestions={usedSuggestedQuestions}
                  onChats={onChats}
                  onStartChatting={onStartChatting}
                  register={register}
                  ref={messageWindowRef}
                  onSuggestedQuestionClick={onSuggestedQuestionClick}
                  setWouldLive={setWouldLive}
                  wouldLive={wouldLive}
                  chatRoomId={onRealTime?.chatroom ?? ""}
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
              usedSuggestedQuestions={usedSuggestedQuestions}
              onChats={onChats}
              onStartChatting={onStartChatting}
              register={register}
              ref={messageWindowRef}
              onSuggestedQuestionClick={onSuggestedQuestionClick}
              setWouldLive={setWouldLive}
              wouldLive={wouldLive}
              chatRoomId={onRealTime?.chatroom ?? ""}
            />
          )}
          <div
            className={cn("flex justify-center bg-zinc-50 py-2", {
              "bg-black": chatbot?.theme == "dark",
            })}
            style={
              chatbot?.theme === "customize"
                ? {
                    background: theme?.containerBackground,
                    borderColor: theme?.borderColor,
                  }
                : {}
            }
          >
            <p className="text-gray-400 text-xs">Powered By Web Kouah AI</p>
          </div>
        </motion.div>
      </Loader>{" "}
    </div>
  );
};

export default ChatWindow;
