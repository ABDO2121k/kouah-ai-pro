import Accordion from "@/components/accordion/Accordion";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCustomizeContext } from "@/context/use-customize-context";
import { ChatbotType } from "@/hooks/chatbot/use-chatbot";
import React from "react";

const HelpDisk = ({ chatbot }: { chatbot: ChatbotType }) => {
  return (
    <div className="h-[calc(100vh-9rem)] overflow-y-auto overflow-x-hidden p-4 flex flex-col gap-4 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
      <div>
        <CardTitle>Help Desk</CardTitle>
        <CardDescription>
          Browse from a list of questions people usually ask.
        </CardDescription>
      </div>
      <Separator orientation="horizontal" />
      {/* eslint-disable-next-line */}
      {chatbot?.HelpDesk?.map((desk: any) => (
        <Accordion
          key={desk?.id}
          trigger={desk?.question}
          content={desk?.answer}
          theme={chatbot?.theme}
        />
      ))}
    </div>
  );
};

export default HelpDisk;
