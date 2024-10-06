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
  isSelected?: boolean;
};

const ChatCard = ({
  title,
  description,
  createdAt,
  onChat,
  seen,
  isSelected,
}: Props) => {
  return (
    <Card
      onClick={onChat}
      className={`rounded-none border-r-0 hover:bg-muted cursor-pointer transition duration-150 ease-in-out ${
        !seen ? 'bg-blue-50' : ''
      } ${
        isSelected ? 'bg-blue-100 border-l-4 border-blue-500' : ''
      }`}
    >
      <CardContent className="py-4 flex gap-3">
        <div className="flex-shrink-0">
          <Avatar>
            <AvatarFallback className="bg-muted">
              <User />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col sm:flex-row justify-between w-full min-w-0">
          <div className="min-w-0 flex-grow">
            <div className="flex items-center gap-2 mb-1">
              <CardDescription className={`leading-none text-gray-600 truncate ${!seen ? 'font-bold' : ''} ${isSelected ? 'text-blue-700' : ''}`}>
                {title}
              </CardDescription>
              {!seen && <AlertCircle className="h-4 w-4 flex-shrink-0 text-blue-500" />}
            </div>
            <CardDescription className={`truncate ${!seen ? 'font-semibold' : ''} ${isSelected ? 'text-blue-600' : ''}`}>
              {description || "This chatroom is empty"}
            </CardDescription>
          </div>
          <div className="mt-1 sm:mt-0 sm:ml-2 flex-shrink-0">
            <CardDescription className={`text-xs ${!seen ? 'font-semibold text-blue-600' : ''} ${isSelected ? 'text-blue-700' : ''}`}>
              {createdAt ? (
                dayjs(createdAt).isSame(dayjs(), 'day') ?
                  dayjs(createdAt).format('HH:mm') :
                  dayjs(createdAt).format('DD MMM')
              ) : ""}
            </CardDescription>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatCard;
