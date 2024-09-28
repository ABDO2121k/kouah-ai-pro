import React, { useRef } from "react";
import { Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textareaResized";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCustomizeContext } from "@/context/use-customize-context";
import { useCustomizeThemeContext } from "@/context/use-theme-context";

const ChatInput = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { chatbot, watch } = useCustomizeContext();
  const theme = watch("theme");
  const { theme: chatbotTheme } = useCustomizeThemeContext();

  return (
    <div
      className={cn("relative w-full bg-zinc-50 text-black", {
        "bg-black": theme == "dark",
      })}
      style={
        theme === "customize"
          ? {
              // color: chatbotTheme?.primaryTextColor,
              background: chatbotTheme?.containerBackground,
            }
          : {}
      }
    >
      <div
        className="mx-2 flex flex-row p-1 md:mx-4 lg:mx-auto lg:max-w-2xl xl:max-w-3xl"
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
                  "text-white": theme == "dark",
                })}
                style={
                  theme === "customize"
                    ? { color: chatbotTheme?.primaryBackground }
                    : {}
                }
              />
              <Input
                type="file"
                id="bot-image"
                className="hidden"
                accept="image/*"
              />
            </Label>

            {/* Resizable TextArea */}
            <Textarea
              id="textarea"
              rows={1}
              maxRows={4}
              placeholder={chatbot?.placeHolder}
              className={`flex-1 resize-y text-base py-1 pr-10 w-[85%] scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch placeholder-[${
                theme === "customize"
                  ? chatbotTheme?.primaryTextColor
                  : "#06b6d4"
              }]`} // Adjusted width and padding
              
            />

            {/* Send button */}
            <Button
              disabled={false}
              type="submit"
              aria-label="send button"
              className="ml-2 p-1 w-[10%]" // Added width to the button
              style={
                theme === "customize"
                  ? {
                      color: chatbotTheme?.primaryTextColor,
                      background: chatbotTheme?.primaryBackground,
                    }
                  : {}
              }
            >
              <Send className="h-4 w-4 mx-auto" />{" "}
              {/* Centered icon inside the button */}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
