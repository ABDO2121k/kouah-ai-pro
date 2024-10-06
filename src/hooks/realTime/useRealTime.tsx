"use client";
import {
  ChatBotMessageProps,
  ChatBotMessageSchema,
} from "@/schemas/conversation-shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import socketIOClient from "socket.io-client";
import { useGetChatbot } from "@/hooks/chatbot/use-chatbot";
import {
  addMessagesToChatRoom,
  makeChatReadsTrue,
  makeRoomLive,
} from "@/actions/ai";
import { useUploadThing } from "@/lib/uploadThing";
import { toast } from "../use-toast";

const socketUrl = "https://kouah-ai-socket.onrender.com";
// Create a single socket instance outside of the hook
const socket = socketIOClient(socketUrl);

export const useRealTime = (
  chatRoom: string,
  setChats: React.Dispatch<
    React.SetStateAction<
      {
        role: "user" | "assistant";
        content: string;
        isImage?: boolean;
      }[]
    >
  >,
  mode?: boolean
) => {
  useEffect(() => {
    if (mode === undefined || mode === true) {
      socket.emit("join", chatRoom);
      const handleRealtimeMode = (data: {
        chat: {
          role: "user" | "assistant";
          message: string;
          isImage?: boolean;
        };
      }) => {
        setChats((prev) => [
          ...prev,
          {
            role: data.chat.role,
            content: data.chat.message,
            isImage: data.chat.isImage,
          },
        ]);
      };

      socket.on("realtime-mode", handleRealtimeMode);

      return () => {
        socket.off("realtime-mode", handleRealtimeMode);
        socket.emit("leave", chatRoom);
      };
    }
  }, [chatRoom, setChats, mode]);
};

export const useToggleMode = (
  chatRoom: string,
  setCurrentRoomId: React.Dispatch<
    React.SetStateAction<{ chatroom: string; mode: boolean } | undefined>
  >
) => {
  useEffect(() => {
    socket.emit("join", chatRoom);

    const handleRoomToggled = async (data: { modeValue: boolean }) => {
      // alert("ss");
      await makeRoomLive(chatRoom, data.modeValue);
      setCurrentRoomId((prev) =>
        prev ? { ...prev, mode: data.modeValue } : undefined
      );
    };

    socket.on("room_toggled", handleRoomToggled);

    return () => {
      socket.off("room_toggled", handleRoomToggled);
      socket.emit("leave", chatRoom);
    };
  }, [chatRoom, setCurrentRoomId]);
};

export const useSendMessage = () => {
  const sendMessage = useCallback(
    (
      chatRoom: string,
      message: string,
      role: "user" | "assistant",
      isImage?: boolean
    ) => {
      socket.emit("send_message", {
        room: chatRoom,
        message: { role, message, isImage: isImage ?? false },
      });
    },
    []
  );

  const emitNewRoom = useCallback((roomId: string) => {
    socket.emit("new_room", { roomId });
  }, []);

  const emitNewMessageToChatbot = useCallback((roomId: string) => {
    socket.emit("new_message_to_chatbot", { roomId });
  }, []);
  const toggleRoomMode = useCallback((roomId: string, value: boolean) => {
    socket.emit("room_toggle", { roomId, value });
  }, []);

  return { sendMessage, emitNewRoom, emitNewMessageToChatbot, toggleRoomMode };
};

export const useChatbotRealTime = (chatbotId: string | undefined) => {
  const { setActions } = useGetChatbot();

  useEffect(() => {
    if (chatbotId) {
      socket.emit("join", chatbotId);
      const handleNewRoomCreated = () => {
        setActions((prev) => prev + 1);
      };

      const handleNewMessageFromChatbot = () => {
        setActions((prev) => prev + 1);
      };

      socket.on("new_room_created", handleNewRoomCreated);
      socket.on("new_message_from_chatbot", handleNewMessageFromChatbot);

      return () => {
        socket.off("new_room_created", handleNewRoomCreated);
        socket.off("new_message_from_chatbot", handleNewMessageFromChatbot);
        socket.emit("leave", chatbotId);
      };
    }
  }, [chatbotId, setActions]);
};

export const useAdvancedRealTime = () => {
  const { chatbot, setActions, actions } = useGetChatbot();
  const { startUpload } = useUploadThing("fileUploader");
  const [currentRoomId, setCurrentRoomId] = useState<
    { chatroom: string; mode: boolean } | undefined
  >(undefined);
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string; isImage?: boolean }>
  >([]);
  const messageWindowRef = useRef<HTMLDivElement>(null);

  const onScrollToBottom = () => {
    messageWindowRef.current?.scroll({
      top: messageWindowRef.current.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    onScrollToBottom();
  }, [messages, messageWindowRef]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChatBotMessageProps>({
    resolver: zodResolver(ChatBotMessageSchema),
  });

  useRealTime(currentRoomId?.chatroom ?? "", setMessages);
  useToggleMode(currentRoomId?.chatroom ?? "", setCurrentRoomId);
  useChatbotRealTime(chatbot?.id);

  const changeRoom = useCallback(
    (roomId: string) => {
      const selectedRoom = chatbot?.ChatRoom?.find(
        //eslint-disable-next-line
        (room: any) => room.id === roomId
      );

      if (selectedRoom) {
        roomViewed(roomId);
        setCurrentRoomId({ mode: selectedRoom?.live, chatroom: roomId });
        setActions((prev) => prev + 1);
      } else {
        setMessages([]);
      }
    },
    [chatbot?.ChatRoom, setActions]
  );

  const sendMessage = useCallback(
    (message: string, isImage?: boolean) => {
      if (currentRoomId && socket) {
        socket.emit("send_message", {
          room: currentRoomId.chatroom,
          message: { role: "assistant", message, isImage: isImage ?? false },
        });
        // setMessages((prev) => [
        //   ...prev,
        //   { role: "user", content: message, isImage },
        // ]);
      }
    },
    [currentRoomId]
  );

  const handleSendMessage = handleSubmit(async (values) => {
    if (currentRoomId?.chatroom) {
      if (values.image && values.image.length > 0 && currentRoomId?.chatroom) {
        console.log("IMAGE FROM ", values.image[0]);
        const fileReader = new FileReader();
        fileReader.onload = async (e) => {
          const newLogoUrl = e.target?.result as string;
          sendMessage(newLogoUrl, true);
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
            await addMessagesToChatRoom(currentRoomId.chatroom, [
              { content: uploaded[0].url, isImage: true, role: "user" },
            ]);
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
      }
      if (values.content) {
        sendMessage(values.content, false);
        await addMessagesToChatRoom(currentRoomId.chatroom || "", [
          { content: values.content, isImage: false, role: "user" },
        ]);
      }
    }

    reset();
  });

  const toggleRoomMode = useCallback((roomId: string, value: boolean) => {
    socket.emit("room_toggle", { roomId, value });
  }, []);

  const roomViewed = async (roomId: string) => {
    await makeChatReadsTrue(roomId, true);
    setActions((prev) => prev + 1);
  };

  useEffect(() => {
    if (chatbot?.ChatRoom) {
      const currentRoom = chatbot.ChatRoom.find(
        //eslint-disable-next-line
        (room: any) => room?.id === currentRoomId?.chatroom
      );
      if (currentRoom) {
        //eslint-disable-next-line
        const formattedMessages = currentRoom.message.map((msg: any) => ({
          role: msg.role as "user" | "assistant",
          content: msg.message,
          isImage: msg?.isImage,
        }));
        setMessages(formattedMessages);
      }
    }
  }, [chatbot?.ChatRoom, currentRoomId]);

  return {
    currentRoomId,
    messages,
    changeRoom,
    sendMessage,
    handleSendMessage,
    chatRooms: chatbot?.ChatRoom || [],
    register,
    errors,
    reset,
    messageWindowRef,
    toggleRoomMode,
    roomViewed,
  };
};
