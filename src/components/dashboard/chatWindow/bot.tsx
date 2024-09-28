import React, { forwardRef, useState } from "react";
import Bubble from "./bubble";
import { ThemeType } from "@/actions/customize";
import { ChatbotType, useChatbot } from "@/hooks/chatbot/use-chatbot";
import { Responding } from "./responding";
import { SuggestedQ } from "@/components/tooltip/SuggestedQ";
import ChatInput from "./ChatInput";

// const Bot = ({
//   theme,
//   chatbot,
//   onAiTyping,
//   onChats,
//   onStartChatting,
//   register,
// }: {
//   theme: ThemeType;
//   chatbot: ChatbotType;
//   onAiTyping: boolean;
//   onChats: ReturnType<typeof useChatbot>["onChats"];
//   onStartChatting: ReturnType<typeof useChatbot>["onStartChatting"];
//   register: ReturnType<typeof useChatbot>["register"];
// }) => {
//   return (
//     <div className="relative h-[calc(100vh-9rem)] flex flex-col gap-2 ">
//       <div className="flex-grow overflow-y-auto overflow-x-hidden px-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
//         <Bubble
//           message={{
//             role: "assistant",
//             content: chatbot?.initialMessage ?? "",
//           }}
//           style={
//             chatbot?.theme === "customize"
//               ? {
//                   color: theme?.botMessageTextColor,
//                   background: theme?.botMessageBackground,
//                 }
//               : {}
//           }
//           chatbot={chatbot}
//         />
//         <SuggestedQ suggestQ={chatbot?.suggestQ ?? []} />
//         {onChats.slice(1).map((chat, key) => (
//           <Bubble
//             key={key}
//             message={chat}
//             style={
//               chatbot?.theme === "customize"
//                 ? {
//                     color: theme?.botMessageTextColor,
//                     background: theme?.botMessageBackground,
//                   }
//                 : {}
//             }
//             chatbot={chatbot}
//           />
//         ))}
//         {onAiTyping && <Responding />}
//       </div>
//       <div className="h-auto border-t pt-1">
//         <ChatInput
//           theme={theme}
//           chatbot={chatbot}
//           onAiTyping={onAiTyping}
//           onStartChatting={onStartChatting}
//           register={register}
//         />
//       </div>
//     </div>
//   );
// };

// export default Bot;

type BotProps = {
  theme: ThemeType;
  chatbot: ChatbotType;
  onAiTyping: boolean;
  onChats: ReturnType<typeof useChatbot>["onChats"];
  onStartChatting: ReturnType<typeof useChatbot>["onStartChatting"];
  register: ReturnType<typeof useChatbot>["register"];
};
const Bot = forwardRef<HTMLDivElement, BotProps>(
  ({ theme, chatbot, onAiTyping, onChats, onStartChatting, register }, ref) => {
    return (
      <div className="relative h-[calc(100vh-9rem)] flex flex-col gap-2">
        <div
          ref={ref}
          className="flex-grow overflow-y-auto overflow-x-hidden px-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
        >
          <Bubble
            message={{
              role: "assistant",
              content: chatbot?.initialMessage ?? "",
            }}
            style={
              chatbot?.theme === "customize"
                ? {
                    color: theme?.botMessageTextColor,
                    background: theme?.botMessageBackground,
                  }
                : {}
            }
            chatbot={chatbot}
          />
          <SuggestedQ
            suggestQ={chatbot?.suggestQ ?? []}
            theme={chatbot?.theme}
            chatbotTheme={theme}
          />
          {onChats.slice(1).map((chat, key) => (
            <Bubble
              key={key}
              message={chat}
              style={
                chatbot?.theme === "customize"
                  ? {
                      color:
                        chat.role == "user"
                          ? theme?.placeholderTextColor
                          : theme?.botMessageTextColor,
                      background:
                        chat.role == "user"
                          ? theme?.textBackground
                          : theme?.botMessageBackground,
                    }
                  : {}
              }
              chatbot={chatbot}
            />
          ))}
          {onAiTyping && <Responding />}
        </div>
        <div className="h-auto border-t pt-1">
          <ChatInput
            theme={theme}
            chatbot={chatbot}
            onAiTyping={onAiTyping}
            onStartChatting={onStartChatting}
            register={register}
          />
        </div>
      </div>
    );
  }
);

Bot.displayName = "Bot";
export default Bot;
