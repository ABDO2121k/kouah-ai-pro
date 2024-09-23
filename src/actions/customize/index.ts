"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";

export const updateLogoForm = async (
  chatbotId: string,
  values: {
    logo?: string | undefined;
    initialMessage: string | undefined;
    suggestQ: string | undefined;
    placeHolder: string | undefined;
  }
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
          logo: values.logo,
          initialMessage: values.initialMessage,
          suggestQ: values.suggestQ ? values.suggestQ?.split("\n") : [],
          placeHolder: values.placeHolder,
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
