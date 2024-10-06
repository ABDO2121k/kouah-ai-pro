import React, { forwardRef } from "react";
import Bubble from "../chatWindow/bubble";
import ChatInput from "../chatWindow/preview/inputPreview";
import RealChatInput from "./RealTimeInput";
import { ChatBotMessageProps } from "@/schemas/conversation-shema";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type RealTimeChatProps = {
  //eslint-disable-next-line
  messages: any[];
  onSendMessage: () => void;
  register: UseFormRegister<ChatBotMessageProps>;
  errors: FieldErrors<ChatBotMessageProps>;
};

const RealTimeChat = forwardRef<HTMLDivElement, RealTimeChatProps>(
  ({ messages, onSendMessage, register, errors }, ref) => {
    return (
      <div className="relative h-[calc(100vh-9rem)] flex flex-col gap-2">
        <div
          ref={ref}
          className="flex-grow overflow-y-auto overflow-x-hidden px-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
        >
          {messages?.map((message, index) => (
            <Bubble
              key={index}
              message={{
                ...message,
              }}
              showRealtime={false}
            />
          ))}
        </div>
        <div className="h-auto border-t pt-1">
          <RealChatInput
            onSendMessage={onSendMessage}
            register={register}
            errors={errors}
          />
        </div>
      </div>
    );
  }
);

RealTimeChat.displayName = "RealTimeChat";
export default RealTimeChat;
