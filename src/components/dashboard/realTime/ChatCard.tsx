"use client";
import React from "react";
import { User, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import dayjs from "dayjs";

type Props = {
  title: string;
  description?: string;
  createdAt: Date;
  id: string;
  onChat?: () => void;
  seen?: boolean;
};

const ChatCard = ({
  title,
  description,
  createdAt,
  onChat,
  seen,
}: Props) => {
  return (
    <Card
      onClick={onChat}
      className="rounded-none border-r-0 hover:bg-muted cursor-pointer transition duration-150 ease-in-out"
    >
      <CardContent className="py-4 flex gap-3">
        <div>
          <Avatar>
            <AvatarFallback className="bg-muted">
              <User />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex justify-between w-full">
          <div>
            <div className="flex gap-5 items-center">
              <CardDescription className="font-bold leading-none text-gray-600">
                {title}
              </CardDescription>
              {!seen && <AlertCircle className="h-5 w-5 text-zinc-500 dark:text-zinc-100" />}
            </div>
            <CardDescription>
              {description
                ? description.substring(0, 20) + "..."
                : "This chatroom is empty"}
            </CardDescription>
          </div>
          <div className="w-[100px] flex justify-end">
            <CardDescription className="text-xs">
              {createdAt ? (
                dayjs(createdAt).isSame(dayjs(), 'day') ?
                  dayjs(createdAt).format('HH:mm') :
                  dayjs(createdAt).format('ddd DD MMM HH:mm')
              ) : ""}
            </CardDescription>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatCard;
