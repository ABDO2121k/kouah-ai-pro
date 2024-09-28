"use client";

import { getChatBot } from "@/actions/chatbot";
import { getChatbotTheme, ThemeType } from "@/actions/customize";
import { useChatContext } from "@/context/use-chatbot-context";
import {
  ChatBotMessageProps,
  ChatBotMessageSchema,
} from "@/schemas/conversation-shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "../use-toast";
import { useUploadThing } from "@/lib/uploadThing";
import { chatWithBot } from "@/actions/ai";

type ChatBotsResponse = Awaited<ReturnType<typeof getChatBot>>["chatbot"];
export type ChatbotType = Awaited<ReturnType<typeof getChatBot>>["chatbot"];

export const useChatbot = (chatbotId: string) => {
  const { startUpload } = useUploadThing("logoUploader");
  //eslint-disable-next-line
  const [chatbot, setChatbot] = useState<ChatBotsResponse>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [wouldLive, seWouldLive] = useState(); // hadi drtha 3la 7sab chatot ila sft online atwlli true bax n affichiw simple form for email bax dik sa3a nswbo chatRoom w nrdoha live
  const [onChats, setOnChats] = useState<
    {
      role: "assistant" | "user";
      content: string;
      isImage?: boolean;
    }[]
  >([]);
  const [theme, setTheme] = useState<ThemeType>(null);
  const [onAiTyping, setOnAiTyping] = useState<boolean>(false);
  const [onRealTime, setOnRealTime] = useState<
    { chatroom: string; mode: boolean } | undefined
  >(undefined);
  const messageWindowRef = useRef<HTMLDivElement>(null);

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
  // const onScrollToBottom = () => {
  //   setTimeout(() => {
  //     if (messageWindowRef?.current != null) {
  //       messageWindowRef.current.scrollTop =
  //         messageWindowRef.current.scrollHeight;
  //     }
  //   }, 500);
  // };

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
    }
  };
  const getTheme = async () => {
    const response = await getChatbotTheme(chatbotId);
    if (response.code == 200) {
      setTheme(response.theme);
    } else {
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    setLoading(true);
    if (chatbotId) {
      setOnChats([]);
      onGetChatBot(chatbotId);
      getTheme();
    }
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, [chatbotId]);

  const onStartChatting = handleSubmit(async (values) => {
    // console.log("ALL VALUES", values);
    setOnAiTyping(true);
    if (values.image.length) {
      console.log("IMAGE fROM ", values.image[0]);
      if (!onRealTime?.mode) {
        // const newLogoUrl = URL.createObjectURL(values.image[0]);
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
          const newLogoUrl = event?.target?.result ?? ""; // The image data URL
          //eslint-disable-next-line
          setOnChats((prev: any) => [
            ...prev,
            {
              role: "user",
              content: newLogoUrl,
              isImage: true,
            },
          ]);
        };
        fileReader.readAsDataURL(values.image[0]);
      }
      const uploaded = await startUpload([values.image[0]]);

      // const response = await onAiChatBotAssistant(
      //   currentBotId!,
      //   onChats,
      //   "user",
      //   uploaded.uuid
      // );

      // if (response) {
      //   setOnAiTyping(false);
      //   if (response.live) {
      //     setOnRealTime((prev) => ({
      //       ...prev,
      //       chatroom: response.chatRoom,
      //       mode: response.live,
      //     }));
      //   } else {
      //     setOnChats((prev: any) => [...prev, response.response]);
      //   }
      // }
    }
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

      const response = await chatWithBot(chatbotId, onChats, values.content);

      if (response) {
        if (response.status === 200) {
          // console.log({ resp: response.response?.body });
          // const reader = response.response.body.getReader();
          // const decoder = new TextDecoder();
          // let done = false;
          // let accumulatedResponse = "";

          setOnAiTyping(false);
          setOnChats((prev) => [
            ...prev,
            { role: "assistant", content: response.response ?? " " },
          ]);

          // while (!done) {
          //   const { value, done: doneReading } = await reader.read();
          //   done = doneReading;
          //   const chunkValue = decoder.decode(value);
          //   accumulatedResponse += chunkValue;

          //   setOnChats((prev) => {
          //     const updatedChats = [...prev];
          //     updatedChats[updatedChats.length - 1] = {
          //       role: "assistant",
          //       content: accumulatedResponse,
          //     };
          //     return updatedChats;
          //   });
          // }
        } else {
          // Handle error
          console.error("Error in chatbot response:", response);
          toast({
            title: "Error",
            description: "An error occurred while processing your request.",
            variant: "destructive",
          });
        }
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
    theme,
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
    setChatbot,
  };
};
