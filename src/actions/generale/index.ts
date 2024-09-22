"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";

export const updateGenerale = async (
  chatbotId: string,
  values: { description: string | undefined; isHelpDisk: boolean; title: string,isLead:boolean,isRealTimeChat:boolean }
) => {
  try {
    const userClerk = await currentUser();
    if (!userClerk) throw new Error("user not found !!!");
    const dbChatbot = await db.chatBot.findFirst({
      where: {
        id: chatbotId,
        User: {
          clerkId: userClerk.id ?? "",
        },
      },
    });
    if (dbChatbot) {
      await db.chatBot.update({
        where: {
          id: chatbotId,
        },
        data: {
          // eslint-disable-next-line
          description: values.description,
          title: values.title,
          isHelpDisk: values.isHelpDisk,
          isLead: values.isLead,
        isRealTimeChat: values.isRealTimeChat
        },
      });
    } else {
      throw new Error("Chatbot not found or you don't have access to it.");
    }
    return { message: "KouahBot updated with success", code: 200 };
    // eslint-disable-next-line
  } catch (err: any) {
    console.log({ err });
    return { message: err?.message, code: 500 };
  }
};
