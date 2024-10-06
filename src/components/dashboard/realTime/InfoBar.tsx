import { Loader } from "@/components/loader";
import { Switch } from "@/components/ui/switch";
import React from "react";

interface CurrentRoomId {
  chatroom: string;
  mode: boolean;
}

interface InfoBarProps {
  currentRoomId: CurrentRoomId;
  toggleRoomMode: (chatroom: string, checked: boolean) => void;
}

const InfoBar: React.FC<InfoBarProps> = ({ currentRoomId, toggleRoomMode }) => {
  return (
    <div className="flex flex-col ">
      <div className="flex gap-5 items-center">
        <h2 className="text-3xl font-bold capitalize">{"settings"}</h2>
        <Loader loading={false} className="p-0 inline">
          <Switch
            disabled={!currentRoomId.mode}
            checked={currentRoomId.mode}
            onCheckedChange={(checked) =>
              toggleRoomMode(currentRoomId.chatroom, checked)
            }
            className="data-[state=checked]:bg-[#06b6d4] data-[state=unchecked]:bg-zinc-500"
          />
        </Loader>
      </div>
      <p className="text-gray-500 text-sm">
        Modify domain settings, change chatbot options, enter sales questions
        and train your bot to do what you want it to.
      </p>
    </div>
  );
};

export default InfoBar;
