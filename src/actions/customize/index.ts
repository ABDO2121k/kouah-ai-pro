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
    theme: "light" | "dark" | "customize";
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
          theme: values.theme,
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

export const updateThemeForm = async (
  chatbotId: string,
  values: {
    containerBackground: string;
    borderColor: string;
    primaryTextColor: string;
    primaryBackground: string;
    botMessageTextColor: string;
    botMessageBackground: string;
    suggestedQuestionTextColor: string;
    suggestedQuestionBackground: string;
    textColor: string;
    textBackground: string;
    placeholderTextColor: string;
  }
) => {
  try {
    await db.chatbotTheme.upsert({
      where: {
        chatbotId: chatbotId,
      },
      update: { ...values },
      create: {
        chatbotId: chatbotId,
        ...values,
      },
    });
    return { message: "KouahBot updated with success", code: 200 };
    //eslint-disable-next-line
  } catch (err: any) {
    console.log({ err });
    return { message: err?.message, code: 500 };
  }
};

export const getChatbotTheme = async (chatbotId: string) => {
  try {
    const theme = await db.chatbotTheme.findFirst({
      where: {
        chatbotId: chatbotId,
      },
      select: {
        containerBackground: true,
        borderColor: true,
        primaryTextColor: true,
        primaryBackground: true,
        botMessageTextColor: true,
        botMessageBackground: true,
        suggestedQuestionTextColor: true,
        suggestedQuestionBackground: true,
        textColor: true,
        textBackground: true,
        placeholderTextColor: true,
      },
    });
    return { message: "success", theme, code: 200 };
    //eslint-disable-next-line
  } catch (err: any) {
    console.log({ err });
    return { message: err?.message, code: 500, theme: null };
  }
};

export type ThemeType = Awaited<ReturnType<typeof getChatbotTheme>>["theme"];
