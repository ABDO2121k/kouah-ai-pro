import React, { useRef } from "react";
import { Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textareaResized";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCustomizeContext } from "@/context/use-customize-context";

const ChatInput = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { chatbot, watch } = useCustomizeContext();
  const theme = watch("theme");

  return (
    <div className="absolute bottom-0 left-0 w-full">
      <form
        className="mx-2 flex flex-row p-3 md:mx-4 lg:mx-auto lg:max-w-2xl xl:max-w-3xl"
        // eslint-disable-next-line
        onSubmit={(e: any) => e.preventDefault()}
      >
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col flex-grow p-4">
            <div className="relative">
              {/* File input for uploading images */}
              <Label
                htmlFor="bot-image"
                className="flex items-center mb-2 cursor-pointer"
              >
                <Paperclip
                  className={cn("", {
                    "text-white": theme == "dark",
                  })}
                />
                <Input
                  type="file"
                  id="bot-image"
                  className="hidden"
                  accept="image/*" // Accept only image files
                />
              </Label>

              {/* Text area for inputting questions */}
              <Textarea
                ref={textareaRef}
                rows={1}
                maxRows={4}
                placeholder={chatbot?.placeHolder}
                className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    textareaRef.current?.focus();
                  }
                }}
              />

              {/* Send button */}
              <Button
                disabled={false}
                aria-label="send button"
                className="absolute bottom-1.5 right-[8px]"
                onClick={() => {
                  textareaRef.current?.focus();
                }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
