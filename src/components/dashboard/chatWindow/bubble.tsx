import React from "react";
import { cn, extractUUIDFromString, getMonthName } from "@/lib/utils";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";

type Props = {
  message: {
    role: "assistant" | "user";
    content: string;
    link?: string;
  };
  createdAt?: Date;
};

const Bubble = ({ message, createdAt }: Props) => {
  const image = extractUUIDFromString(message.content);

  return (
<div
  className={cn('flex items-end p-2 my-2', {
    'justify-end': message.role !== "assistant",
  })}
>
  <div
    className={cn(
      'relative flex h-6 w-6 aspect-square items-center justify-center',
      {
        'order-2 rounded-sm': message.role !== "assistant",
        'order-1  rounded-sm': message.role === "assistant",
      }
    )}
  >
    {message.role === "assistant" ? (
      <Avatar className="w-5 h-5">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ) : (
      <Avatar className="w-5 h-5">
        <AvatarFallback>
          <User />
        </AvatarFallback>
      </Avatar>
    )}
  </div>

  <div
    className={cn(
      'flex flex-col space-y-2 text-base max-w-md mx-2 w-full break-words',
      {
        'order-1 items-end': message.role !== "assistant",
        'order-2 items-start': message.role === "assistant",
      }
    )}
  >
    <div
      className={cn(
        'px-4 py-2 rounded-lg inline-block max-w-[60%] w-full', // Limit width to 60% of the page
        {
          'bg-[#06b6d4] text-white': message.role !== "assistant",
          'bg-muted text-gray-900': message.role === "assistant",
          'rounded-br-none': message.role !== "assistant",
          'rounded-bl-none': message.role === "assistant",
        }
      )}
    >
      {image ? (
        <div className="relative aspect-square max-w-[60%] w-full"> {/* Image width constraint */}
          <Image src={`https://ucarecdn.com/${image[0]}/`} fill alt="image" />
        </div>
      ) : (
        <p className="text-sm">
          {message.content.replace("(complete)", " ")}
          {message.link && (
            <Link
              className="underline font-bold pl-2"
              href={message.link}
              target="_blank"
            >
              Your Link
            </Link>
          )}
        </p>
      )}
      
      {createdAt ? (
        <div className="text-xs select-none mt-2 w-full text-right">
          <p>{dayjs(createdAt).format("HH:mm")}</p>
        </div>
      ) : null}
    </div>
  </div>
</div>

  );
};

export default Bubble;
