import { CardDescription } from "@/components/ui/card";
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

const ConversationMenu = ({
  chatRooms,
  onSelectRoom,
  currentRoomId,
}: {
  chatRooms: ChatRoom[];
  onSelectRoom: (roomId: string) => void;
  currentRoomId: string | null;
}) => {
  const sortedChatRooms = [...chatRooms].sort((a, b) => {
    // First, sort by chatRead (false comes first)
    if (a.chatRead === false && b.chatRead === true) return -1;
    if (a.chatRead === true && b.chatRead === false) return 1;

    // If chatRead is the same, sort by createdAt (most recent first)
    const aDate = a.message[a.message.length - 1]?.createdAt || a.createdAt;
    const bDate = b.message[b.message.length - 1]?.createdAt || b.createdAt;
    return bDate.getTime() - aDate.getTime();
  });

  return (
    <div className="flex flex-col">
      {sortedChatRooms.length ? (
        sortedChatRooms.map((room) => (
          <ChatCard
            seen={room.chatRead ?? true}
            id={room.id}
            onChat={() => onSelectRoom(room.id)}
            createdAt={
              room.message[room.message.length - 1]?.createdAt || room.createdAt
            }
            key={room.id}
            title={room.email || "Unknown"}
            description={
              room.message[room.message.length - 1]?.message || "No messages"
            }
            isSelected={currentRoomId === room.id}
          />
        ))
      ) : (
        <CardDescription>No chats for your domain</CardDescription>
      )}
    </div>
  );
};

export default ConversationMenu;
