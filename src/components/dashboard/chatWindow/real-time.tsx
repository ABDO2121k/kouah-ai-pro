import { useRealTime } from "@/hooks/realTime/useRealTime";
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
};

const RealTimeMode = ({ chatRoomId, setChats }: Props) => {
   useRealTime(chatRoomId, setChats)

  return (
    <span className="text-xs px-2 py-1 bg-[#06b6d4] text-white rounded-full">
      Real Time
    </span>
  );
};

export default RealTimeMode;
