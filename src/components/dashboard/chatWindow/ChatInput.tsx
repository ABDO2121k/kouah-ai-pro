import React, { useRef } from "react";
import { Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textareaResized";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChatbotType, useChatbot } from "@/hooks/chatbot/use-chatbot";
import { ThemeType } from "@/actions/customize";

const ChatInput = ({
  chatbot,
  theme,
  onAiTyping,
  onStartChatting,
  register,
}: {
  chatbot: ChatbotType;
  theme: ThemeType;
  onAiTyping: boolean;
  onStartChatting: ReturnType<typeof useChatbot>["onStartChatting"];
  register: ReturnType<typeof useChatbot>["register"];
}) => {

  return (
    <div
      className={cn("relative w-full bg-zinc-50 text-black", {
        "bg-black": chatbot?.theme == "dark",
      })}
      style={
        chatbot?.theme === "customize"
          ? {
              // color: theme?.primaryTextColor,
              background: theme?.containerBackground,
            }
          : {}
      }
    >
      <form
        className="mx-2 flex flex-row p-1 md:mx-4 lg:mx-auto lg:max-w-2xl xl:max-w-3xl"
        onSubmit={onStartChatting}
      >
        <div className="relative flex h-full flex-1 items-center">
          {/* File Input and Textarea in one line */}
          <div className="flex flex-grow items-center space-x-2">
            {/* File input for uploading images */}
            <Label
              htmlFor="bot-image"
              className="flex items-center cursor-pointer w-[5%]" // Reduced width for icon
            >
              <Paperclip
                className={cn("mr-1 w-full", {
                  "text-white": chatbot?.theme == "dark",
                })}
                style={
                  chatbot?.theme === "customize"
                    ? { color: theme?.primaryBackground }
                    : {}
                }
              />
              <Input
                type="file"
                id="bot-image"
                className="hidden"
                accept="image/*"
                {...register("image")}
              />
            </Label>

            {/* Resizable TextArea */}
            <Textarea
              id="textarea"
              rows={1}
              maxRows={4}
              placeholder={chatbot?.placeHolder}
              className={`flex-1 resize-y text-base py-1 pr-10 w-[85%] scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch placeholder-[${
                chatbot?.theme === "customize"
                  ? theme?.primaryTextColor
                  : "#06b6d4"
              }]`} // Adjusted width and padding
              {...register("content")}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onStartChatting();
                }
              }}
            />

            {/* Send button */}
            <Button
              disabled={onAiTyping}
              type="submit"
              aria-label="send button"
              className="ml-2 p-1 w-[10%]" // Added width to the button
              style={
                chatbot?.theme === "customize"
                  ? {
                      color: theme?.primaryTextColor,
                      background: theme?.primaryBackground,
                    }
                  : {}
              }
            >
              <Send className="h-4 w-4 mx-auto" />{" "}
              {/* Centered icon inside the button */}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
