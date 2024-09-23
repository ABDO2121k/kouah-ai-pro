"use client";

import { getChatBot } from "@/actions/chatbot";
import { useChatContext } from "@/context/use-chatbot-context";
import {
  ChatBotMessageProps,
  ChatBotMessageSchema,
} from "@/schemas/conversation-shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

type ChatBotsResponse = Awaited<ReturnType<typeof getChatBot>>["chatbot"];
export type ChatbotType = Awaited<ReturnType<typeof getChatBot>>["chatbot"];

export const useChatbot = (chatbotId: string) => {
  //eslint-disable-next-line
  const [chatbot, setChatbot] = useState<ChatBotsResponse>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [onChats, setOnChats] = useState<
    { role: "assistant" | "user"; content: string; link?: string }[]
  >([]);
  const [onAiTyping, setOnAiTyping] = useState<boolean>(false);
  const [onRealTime, setOnRealTime] = useState<
    { chatroom: string; mode: boolean } | undefined
  >(undefined);
  const messageWindowRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChatBotMessageProps>({
    resolver: zodResolver(ChatBotMessageSchema),
  });

  const onScrollToBottom = () => {
    messageWindowRef.current?.scroll({
      top: messageWindowRef.current.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    onScrollToBottom();
  }, [onChats, messageWindowRef]);

  const onGetChatBot = async (id: string) => {
    const chatbot = await getChatBot(id);
    if (chatbot) {
      setOnChats((prev) => {
        // alert(JSON.stringify(prev));
        if (prev.length > 0) {
          return [...prev];
        }
        return [
          ...prev,
          {
            role: "assistant",
            content: chatbot?.chatbot?.initialMessage ?? "",
          },
        ];
      });
      setChatbot(chatbot.chatbot);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatbotId) {
      setOnChats([]);
      onGetChatBot(chatbotId);
    }
  }, [chatbotId]);

  const onStartChatting = handleSubmit(async (values) => {
    // console.log("ALL VALUES", values);

    // if (values.image.length) {
    //   console.log("IMAGE fROM ", values.image[0]);
    //   const uploaded = await upload.uploadFile(values.image[0]);
    //   if (!onRealTime?.mode) {
    //     setOnChats((prev: any) => [
    //       ...prev,
    //       {
    //         role: "user",
    //         content: uploaded.uuid,
    //       },
    //     ]);
    //   }

    //   console.log("🟡 RESPONSE FROM UC", uploaded.uuid);
    //   setOnAiTyping(true);
    //   const response = await onAiChatBotAssistant(
    //     currentBotId!,
    //     onChats,
    //     "user",
    //     uploaded.uuid
    //   );

    //   if (response) {
    //     setOnAiTyping(false);
    //     if (response.live) {
    //       setOnRealTime((prev) => ({
    //         ...prev,
    //         chatroom: response.chatRoom,
    //         mode: response.live,
    //       }));
    //     } else {
    //       setOnChats((prev: any) => [...prev, response.response]);
    //     }
    //   }
    // }
    reset();

    if (values.content) {
      if (!onRealTime?.mode) {
        //eslint-disable-next-line
        setOnChats((prev: any) => [
          ...prev,
          {
            role: "user",
            content: values.content,
          },
        ]);
      }

      setOnAiTyping(true);

      //   const response = await onAiChatBotAssistant(
      //     currentBotId!,
      //     onChats,
      //     'user',
      //     values.content
      //   )

      const response = {
        role: "assistant",
        content: values.content,
      };
      if (response) {
        // if (response.live) {
        //   setOnRealTime((prev) => ({
        //     ...prev,
        //     chatroom: response.chatRoom,
        //     mode: response.live,
        //   }));
        // } else {
        setTimeout(() => {
          //eslint-disable-next-line
          setOnChats((prev: any) => [...prev, response]);
          setOnAiTyping(false);
        }, 1000);

        // }
      }
    }
  });

  return {
    chatbot,
    onStartChatting,
    onChats,
    register,
    onAiTyping,
    messageWindowRef,
    loading,
    setOnChats,
    onRealTime,
    errors,
  };
};

export const useGetChatbot = () => {
  const { selectedChatbot, chatbots, setActions } = useChatContext();
  // eslint-disable-next-line
  const [chatbot, setChatbot] = useState<any>(null);

  useEffect(() => {
    if (chatbots && chatbots.length > 0 && selectedChatbot) {
      const bot = chatbots.find((bot) => bot.id === selectedChatbot);
      setChatbot(bot);
    }
  }, [chatbots, selectedChatbot]);
  return {
    chatbot,
    setActions,
    setChatbot
  };
};
