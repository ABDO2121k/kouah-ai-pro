import ChatWindow from "@/components/dashboard/chatWindow";
import React from "react";

type Props = { params: { chatbotId: string } };
const page = ({ params }: Props) => {
  const { chatbotId } = params;

  return (
    <div className="h-screen w-100">
      <ChatWindow chatbotId={chatbotId} />
    </div>
  );
};

export default page;
