import { useRealTime, useToggleMode } from "@/hooks/realTime/useRealTime";
import React from "react";

type Props = {
  chatRoomId: string;
  setChats: React.Dispatch<
    React.SetStateAction<
      {
        role: "user" | "assistant";
        content: string;
        link?: string | undefined;
      }[]
    >
  >;
  mode: boolean;
  setOnRealTime: React.Dispatch<
    React.SetStateAction<{ chatroom: string; mode: boolean } | undefined>
  >;
};

const RealTimeMode = ({ chatRoomId, setChats, mode, setOnRealTime }: Props) => {
  useToggleMode(chatRoomId, setOnRealTime);

  useRealTime(chatRoomId, setChats, mode);

  if (!mode) return null;

  return (
    <span className="text-xs px-2 py-1 bg-[#06b6d4] text-white rounded-full">
      Real Time
    </span>
  );
};

export default RealTimeMode;
