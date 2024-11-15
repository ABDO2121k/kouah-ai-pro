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
import {
  addMessagesToChatRoom,
  addMessageToQueries,
  chatWithBot,
} from "@/actions/ai";
import { createChatRoom, retrieveChatAndMakeItLive } from "@/actions/ai";
import { useSendMessage } from "@/hooks/realTime/useRealTime";

type ChatBotsResponse = Awaited<ReturnType<typeof getChatBot>>["chatbot"];
export type ChatbotType = Awaited<ReturnType<typeof getChatBot>>["chatbot"];

export const useChatbot = (chatbotId: string) => {
  const { startUpload } = useUploadThing("logoUploader");
  // const { startUpload } = useUploadThing("fileUploader");

  //eslint-disable-next-line
  const [chatbot, setChatbot] = useState<ChatBotsResponse>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [iconLoading, setIconLoading] = useState(false);
  const [wouldLive, setWouldLive] = useState(false);
  const [onChats, setOnChats] = useState<
    {
      role: "assistant" | "user";
      content: string;
      isImage?: boolean;
      seen?: boolean;
      isBillingError?: boolean;
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

  const handleChatStream = async (
    question: string,
    currentChats: typeof onChats
  ) => {
    setOnAiTyping(true);
    const response = await chatWithBot(
      chatbotId,
      currentChats,
      question,
      onRealTime?.chatroom
    );

    if (response.status === 200 && response.chatbotInfo) {
      try {
        const streamResponse = await fetch("/api/chat", {
          method: "POST",
          body: JSON.stringify(response.chatbotInfo),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!streamResponse.ok) throw new Error("Stream response not ok");

        const reader = streamResponse.body?.getReader();
        if (!reader) throw new Error("Failed to get stream reader");

        const decoder = new TextDecoder();
        let done = false;
        let accResponse = "";

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;

          if (value) {
            const chunkValue = decoder.decode(value);
            accResponse += chunkValue;

            setOnChats((prev) => {
              const lastMessage = prev[prev.length - 1];
              if (lastMessage?.role === "assistant") {
                return prev.map((msg, index) => {
                  if (index === prev.length - 1) {
                    return { ...msg, content: accResponse };
                  }
                  return msg;
                });
              } else {
                return [...prev, { role: "assistant", content: accResponse }];
              }
            });
          }
        }
        setOnAiTyping(false);
        // After stream ends, update databases
        if (onRealTime?.chatroom) {
          await addMessagesToChatRoom(onRealTime.chatroom, [
            { role: "user", content: question },
            { role: "assistant", content: accResponse },
          ]);
          emitNewMessageToChatbot(chatbotId);
        }

        await addMessageToQueries(chatbotId, question, accResponse);
      } catch (error) {
        console.error("Error reading stream:", error);
        toast({
          title: "Error",
          description: "Failed to process the response stream",
          variant: "destructive",
        });
      }
    } else {
      if (response.isBillingError) {
        setOnChats((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "You have reached your query limit. Please upgrade your plan to continue using the chatbot.",
            isBillingError: true,
          },
        ]);
      }
      console.error("Error in chatbot response:", response);
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
    }
    setOnAiTyping(false);
  };
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

  const onStartChatting = handleSubmit(async (data) => {
    const values = data;
    reset({ content: "", image: undefined });
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
        setOnChats((prev) => [
          ...prev,
          {
            role: "user",
            content: values.content || "",
            isImage: false,
          },
        ]);

        await handleChatStream(values.content, onChats);
      } else {
        sendMessage(onRealTime.chatroom, values.content, "user", false);
        await addMessagesToChatRoom(onRealTime.chatroom, [
          { content: values.content, isImage: false, role: "user" },
        ]);
        emitNewMessageToChatbot(chatbotId);
      }
    }
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

    await handleChatStream(question, onChats);
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
    setIconLoading(true);
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
    setIconLoading(false);
  };

  const toggleRoomMode = useCallback(
    (roomId: string, value: boolean) => {
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
    iconLoading,
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
    chatbots,
  };
};








interface ButtonDesign {
  buttonBackground: string;
  buttonImage?: string|null;
  buttonFullBg: boolean;
  useCustomButton: boolean;
}

export const useButtonDesign = (chatbotId: string) => {
  const [loading, setLoading] = useState(true);
  const [buttonDesign, setButtonDesign] = useState<ButtonDesign>({
    buttonBackground: "#ffff",
    buttonImage: null,
    buttonFullBg: false,
    useCustomButton: false
  });

  useEffect(() => {
    const fetchButtonDesign = async () => {
      try {
        const response = await getChatBot(chatbotId);
        if (response?.chatbot) {
          setButtonDesign({
            buttonBackground: response.chatbot.buttonBackground ?? "#ffff",
            buttonImage: response.chatbot.buttonImage,
            buttonFullBg: response.chatbot.buttonFullBg || false,
            useCustomButton: response.chatbot.useCustomButton || false
          });
        }
      } catch (error) {
        console.error("Error fetching button design:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchButtonDesign();
  }, [chatbotId]);

  return {
    loading,
    buttonDesign
  };
};