"use client";
import { Separator } from "@/components/ui/separator";
import React from "react";
import ConversationMenu from "./ConversationMenu";
import InfoBar from "./InfoBar";
import RealTimeChat from "./Messenger";
import { useAdvancedRealTime } from "@/hooks/realTime/useRealTime";

const RealTime = () => {
  const {
    currentRoomId,
    messages,
    changeRoom,
    register,
    handleSendMessage,
    errors,
    chatRooms,
    messageWindowRef,
    toggleRoomMode,
  } = useAdvancedRealTime();

  return (
    <div className="w-full h-full flex flex-row overflow-x-hidden">
      <div className="w-[40%]">
        <ConversationMenu
          chatRooms={chatRooms}
          onSelectRoom={changeRoom}
          currentRoomId={currentRoomId?.chatroom??""}
        />
      </div>
      <Separator orientation="vertical" />
      <div className="w-[60%] h-full flex flex-col">
        {currentRoomId ? (
          <>
            <div className="px-5">
              <InfoBar currentRoomId={currentRoomId} toggleRoomMode={toggleRoomMode} />
            </div>
            <RealTimeChat
              ref={messageWindowRef}
              messages={messages}
              onSendMessage={handleSendMessage}
              register={register}
              errors={errors}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-lg text-gray-500">Please select a room to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTime;
