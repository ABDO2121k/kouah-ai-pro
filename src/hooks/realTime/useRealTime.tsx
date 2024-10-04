"use client";
import { useCallback, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

export const useRealTime = (
  chatRoom: string,
  setChats: React.Dispatch<
    React.SetStateAction<
      {
        role: "user" | "assistant";
        content: string;
        link?: string | undefined;
      }[]
    >
  >
) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    socketRef.current = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000"
    );

    // Join the chat room
    socketRef.current.emit("join", chatRoom);

    // Listen for real-time messages
    socketRef.current.on("realtime-mode", (data: { chat: { role: "user" | "assistant"; message: string } }) => {
      console.log("✅", data);
      setChats((prev) => [
        ...prev,
        {
          role: data.chat.role,
          content: data.chat.message,
        },
      ]);
    });

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.off("realtime-mode");
        socketRef.current.emit("leave", chatRoom);
        socketRef.current.disconnect();
      }
    };
  }, [chatRoom, setChats]);
};

export const useSendMessage = (chatRoom: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000"
    );
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const sendMessage = useCallback(
    (message: string, role: "user" | "assistant") => {
      if (socketRef.current) {
        socketRef.current.emit("send_message", {
          room: chatRoom,
          message: { role, message },
        });
      }
    },
    [chatRoom]
  );

  return sendMessage;
};
