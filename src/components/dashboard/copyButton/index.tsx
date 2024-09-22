"use client";
import { Copy, CopyCheck } from "lucide-react";
import React, { useState } from "react";

const CopyButton = ({ chatbotId }: { chatbotId: string }) => {
  const [currentCopy, setCurrentCopy] = useState(false);
  const handleCopy = (text: string) => {
    setCurrentCopy(true);
    navigator.clipboard.writeText(text);
    setTimeout(() => {
      setCurrentCopy(false);
    }, 1500);
  };
  return (
    <div className="w-full grid grid-cols-5">
      <span className="truncate text-center text-zinc-800 col-span-4 font-bold">
        {chatbotId}
      </span>
      <span className="col-span-1">
        {currentCopy ? (
          <CopyCheck className="h-4 w-4 cursor-pointer" />
        ) : (
          <Copy
            className="h-4 w-4 cursor-pointer"
            onClick={() => handleCopy(chatbotId)}
          />
        )}
      </span>
    </div>
  );
};

export default CopyButton;
