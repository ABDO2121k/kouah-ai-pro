import React from "react";
import { Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textareaResized";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ChatBotMessageProps } from "@/schemas/conversation-shema";

type ChatInputProps = {
  onSendMessage: (data: ChatBotMessageProps) => void;
  register: UseFormRegister<ChatBotMessageProps>;
  errors: FieldErrors<ChatBotMessageProps>;
};

const RealChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  register,
  errors,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSendMessage({ content: "", image: null });
  };

  return (
    <div className="relative w-full bg-zinc-50 text-black">
      <form
        className="mx-2 flex flex-row p-1 md:mx-4 lg:mx-auto lg:max-w-2xl xl:max-w-3xl"
        onSubmit={handleSubmit}
      >
        <div className="relative flex h-full flex-1 items-center">
          <div className="flex flex-grow items-center space-x-2">
            <Label
              htmlFor="bot-image"
              className="flex items-center cursor-pointer w-[5%]"
            >
              <Paperclip className="mr-1 w-full" />
              <Input
                type="file"
                id="bot-image"
                className="hidden"
                accept="image/*"
                {...register("image")}
              />
            </Label>

            <Textarea
              id="textarea"
              rows={1}
              maxRows={4}
              placeholder="Type your message here..."
              className="flex-1 resize-y text-base py-1 pr-10 w-[85%] scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
              {...register("content")}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  //eslint-disable-next-line
                  handleSubmit(e as any);
                }
              }}
            />

            <Button
              type="submit"
              aria-label="send button"
              className="ml-2 p-1 w-[10%]"
            >
              <Send className="h-4 w-4 mx-auto" />
            </Button>
          </div>
        </div>
      </form>
      {errors.content && (
        <span className="text-red-500 text-sm">{errors.content.message}</span>
      )}
    </div>
  );
};

export default RealChatInput;
