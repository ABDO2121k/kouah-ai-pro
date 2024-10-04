import { CardDescription } from "@/components/ui/card";
import { ChatbotType } from "@/hooks/chatbot/use-chatbot";
import ChatCard from "./ChatCard";

export type ChatRoom = {
  id: string;
  live: boolean | null;
  chatRead: boolean | null;
  mailed: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  message: {
    id: string;
    message: string;
    role: "user" | "assistant";
    createdAt: Date;
    updatedAt: Date;
    chatRoomId: string | null;
    seen: boolean;
  }[];
  email: string | null;
  chatBotId: string;
};
const ConversationMenu = ({ chatRooms }: { chatRooms: ChatRoom[] }) => {
  console.log({ chatRooms });
  return (
    <div className="flex flex-col">
      {chatRooms?.length ? (
        //eslint-disable-next-line
        chatRooms.map((room: any) => (
          <ChatCard
            seen={room?.message[0]?.seen}
            id={room?.id}
            // onChat={() => onGetActiveChatMessages(room.ChatRoom[0].id)}
            createdAt={room?.message[0]?.createdAt}
            key={room?.id}
            title={room?.email}
            description={room.message[0]?.message}
          />
        ))
      ) : (
        <CardDescription>No chats for you domain</CardDescription>
      )}
    </div>
  );
};

export default ConversationMenu;
