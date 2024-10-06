"use client";

import { getChatBot } from "@/actions/chatbot";
import { getChatbotTheme, ThemeType } from "@/actions/customize";
import { useChatContext } from "@/context/use-chatbot-context";
import {
  ChatBotMessageProps,
  ChatBotMessageSchema,
} from "@/schemas/conversation-shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "../use-toast";
import { useUploadThing } from "@/lib/uploadThing";
import { addMessagesToChatRoom, chatWithBot } from "@/actions/ai";
import { createChatRoom, retrieveChatAndMakeItLive } from "@/actions/ai";
import { useSendMessage } from "@/hooks/realTime/useRealTime";

type ChatBotsResponse = Awaited<ReturnType<typeof getChatBot>>["chatbot"];
export type ChatbotType = Awaited<ReturnType<typeof getChatBot>>["chatbot"];

export const useChatbot = (chatbotId: string) => {
  // const { startUpload } = useUploadThing("logoUploader");
  const { startUpload } = useUploadThing("fileUploader");

  //eslint-disable-next-line
  const [chatbot, setChatbot] = useState<ChatBotsResponse>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [wouldLive, setWouldLive] = useState(false);
  const [onChats, setOnChats] = useState<
    {
      role: "assistant" | "user";
      content: string;
      isImage?: boolean;
      seen?: boolean;
    }[]
  >([]);
  const [theme, setTheme] = useState<ThemeType>(null);
  const [onAiTyping, setOnAiTyping] = useState<boolean>(false);
  const [onRealTime, setOnRealTime] = useState<
    { chatroom: string; mode: boolean } | undefined
  >(undefined);
  const messageWindowRef = useRef<HTMLDivElement>(null);
  const [usedSuggestedQuestions, setUsedSuggestedQuestions] = useState<
    string[]
  >([]);
  const [openHistory, setOpenHistory] = useState(false);
  const [loadingLive, setLoadingLive] = useState(false);
  //forms
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChatBotMessageProps>({
    resolver: zodResolver(ChatBotMessageSchema),
  });

  const {
    sendMessage,
    toggleRoomMode: toggleRoomModeSocket,
    emitNewRoom,
    emitNewMessageToChatbot,
  } = useSendMessage();

  const {
    reset: resetEmail,
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<{ email: string }>();

  // end forms
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
    setLoading(false);
  }, [chatbotId]);

  const onStartChatting = handleSubmit(async (values) => {
    if (
      values.image &&
      values.image.length > 0 &&
      onRealTime?.chatroom &&
      onRealTime.mode
    ) {
      console.log("IMAGE FROM ", values.image[0]);
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const newLogoUrl = e.target?.result as string;
        sendMessage(onRealTime.chatroom, newLogoUrl, "user", true);
      };
      fileReader.readAsDataURL(values.image[0]);

      try {
        console.log("Before upload check:", values.image[0]);
        if (!values.image || !values.image[0]) {
          throw new Error("No image file found before upload");
        }
        const uploaded = await startUpload([values.image[0]]);
        console.log("Upload result:", uploaded);
        if (uploaded && uploaded[0] && uploaded[0].url) {
          // sendMessage(onRealTime.chatroom, uploaded[0].url, "user", true);
          await addMessagesToChatRoom(onRealTime.chatroom, [
            { content: uploaded[0].url, isImage: true, role: "user" },
          ]);
          emitNewMessageToChatbot(chatbotId);
        } else {
          throw new Error("Upload failed or returned invalid results");
        }
        //eslint-disable-next-line
      } catch (error: any) {
        console.error("Error uploading image:", error);
        toast({
          title: "Error",
          description: `Failed to upload image: ${error?.message}`,
          variant: "destructive",
        });
      }
    } else {
      console.log("No image to upload or missing chatroom:", {
        hasImage: !!values.image,
        imageLength: values.image?.length,
        chatroom: onRealTime?.chatroom,
      });
    }

    if (values.content) {
      if (!onRealTime?.mode) {
        setOnAiTyping(true);
        setOnChats((prev) => [
          ...prev,
          {
            role: "user",
            content: values.content || "",
            isImage: false,
          },
        ]);
        const response = await chatWithBot(
          chatbotId,
          onChats,
          values.content,
          onRealTime?.chatroom
        );

        if (response) {
          if (response.status === 200) {
            setOnAiTyping(false);
            setOnChats((prev) => [
              ...prev,
              { role: "assistant", content: response.response ?? " " },
            ]);
          } else {
            console.error("Error in chatbot response:", response);
            toast({
              title: "Error",
              description: "An error occurred while processing your request.",
              variant: "destructive",
            });
          }
        }
        setOnAiTyping(false);
      } else {
        sendMessage(onRealTime.chatroom, values.content, "user", false);
        await addMessagesToChatRoom(onRealTime.chatroom, [
          { content: values.content, isImage: false, role: "user" },
        ]);
        emitNewMessageToChatbot(chatbotId);
      }
    }
    reset({ content: "", image: undefined });
  });

  const onSuggestedQuestionClick = async (question: string) => {
    setOnAiTyping(true);

    setOnChats((prev) => [
      ...prev,
      {
        role: "user",
        content: question,
      },
    ]);

    setUsedSuggestedQuestions((prev) => [...prev, question]);

    const response = await chatWithBot(chatbotId, onChats, question);

    if (response) {
      if (response.status === 200) {
        setOnAiTyping(false);
        setOnChats((prev) => [
          ...prev,
          { role: "assistant", content: response.response ?? " " },
        ]);
      } else {
        console.error("Error in chatbot response:", response);
        toast({
          title: "Error",
          description: "An error occurred while processing your request.",
          variant: "destructive",
        });
      }
    }
  };

  const handleLiveSubmit = handleSubmitEmail(async (data) => {
    setLoadingLive(true);
    const response = await createChatRoom(
      chatbotId,
      data.email,
      onChats,
      openHistory ? "history" : wouldLive ? "live" : "history"
    );
    if (response && response.status === 200) {
      setOnRealTime({
        chatroom: response.chatRoomId ?? "",
        mode: response.mode,
      });
      toggleRoomModeSocket(response.chatRoomId ?? "", response.mode);
      emitNewRoom(chatbotId);
      toast({
        title: "Success",
        description: "Live chat started successfully.",
      });
    }
    toast({
      title: response.status == 200 ? "Success" : "Error",
      description: response.message,
      variant: response.status == 200 ? "default" : "destructive",
    });
    if (response.chatHistory) {
      setOnChats(
        response.chatHistory.map((chat) => ({
          role: chat.role as "assistant" | "user",
          content: chat.message,
          isImage: chat.isImage,
        }))
      );
    }
    resetEmail();
    setLoadingLive(false);
    setWouldLive(false);
    setOpenHistory(false);
  });

  const handleMakeRealTime = async () => {
    if (onRealTime?.chatroom) {
      const response = await retrieveChatAndMakeItLive(
        chatbotId,
        onRealTime.chatroom
      );
      if (response.status === 200) {
        setOnRealTime({
          chatroom: response.chatRoomId ?? "",
          mode: response.mode ?? false,
        });
        toggleRoomModeSocket(response.chatRoomId ?? "", response.mode ?? false);
        if (response.chatHistory) {
          setOnChats(
            response.chatHistory.map((chat) => ({
              role: chat.role as "assistant" | "user",
              content: chat.message,
              isImage: chat.isImage,
            }))
          );
        }
        toast({
          title: "Success",
          description: "Chat room retrieved and set to live successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    }
  };

  const toggleRoomMode = useCallback(
    (roomId: string, value: boolean) => {
      alert("hello");
      if (onRealTime?.chatroom === roomId) {
        setOnRealTime((prev) => {
          if (prev?.mode !== value) {
            return {
              chatroom: prev?.chatroom || "",
              mode: value,
            };
          }
          return prev;
        });
      }
    },
    [onRealTime]
  );

  // useEffect(() => {
  //   if (onRealTime) {
  //     toggleRoomMode(onRealTime.chatroom, onRealTime.mode);
  //   }
  // }, [onRealTime?.chatroom, onRealTime?.mode, toggleRoomMode]);

  return {
    chatbot,
    onStartChatting,
    onSuggestedQuestionClick,
    onChats,
    register,
    onAiTyping,
    messageWindowRef,
    loading,
    setOnChats,
    onRealTime,
    setOnRealTime,
    errors,
    theme,
    usedSuggestedQuestions,
    openHistory,
    setOpenHistory,
    wouldLive,
    setWouldLive,
    registerEmail,
    handleLiveSubmit,
    loadingLive,
    handleMakeRealTime,
    toggleRoomMode,
  };
};

export const useGetChatbot = () => {
  const { selectedChatbot, chatbots, setActions, actions } = useChatContext();
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
    actions,
  };
};
