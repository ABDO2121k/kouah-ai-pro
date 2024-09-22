"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";

export const createChatbotHelpDisk = async (
  chatbotId: string,
  values: { answer: string; question: string }
) => {
  try {
    const userClerk = await currentUser();
    if (!userClerk) throw new Error("user not found !!!");
    const chatbot = await db.chatBot.findFirst({
      where: {
        id: chatbotId,
        User: {
          clerkId: userClerk.id ?? "",
        },
      },
    });
    if (!chatbot) throw new Error("chatbot not found !!!!");
    const createdChatbot = await db.chatBot.update({
      where: {
        id: chatbotId,
      },
      data: {
        HelpDesk: {
          create: {
            answer: values.answer,
            question: values.question,
          },
        },
      },
      select: {
        HelpDesk: true,
      },
    });
    if (!createdChatbot) throw new Error("external error server !!");
    return {
      code: 200,
      message: "HelpDisk created with success",
      questions: createdChatbot.HelpDesk,
    };
    //eslint-disable-next-line
  } catch (err: any) {
    return { code: 500, message: err.message, questions: [] };
  }
};

export const onGetAllHelpDeskQuestions = async (chatbotId: string) => {
  const questions = await db.helpDesk.findMany({
    where: {
      chatBotId: chatbotId,
    },
    select: {
      question: true,
      answer: true,
      id: true,
    },
  });

  return {
    status: 200,
    message: "New help desk question added",
    questions: questions,
  };
};

export const deleteChatbotHelpDisk = async (
  chatbotId: string,
  helpDiskId: string
) => {
  try {
    const userClerk = await currentUser();
    if (!userClerk) throw new Error("user not found !!!");
    const chatbot = await db.chatBot.findFirst({
      where: {
        id: chatbotId,
        User: {
          clerkId: userClerk.id ?? "",
        },
      },
    });
    if (!chatbot) throw new Error("chatbot not found !!!!");
    const createdChatbot = await db.chatBot.update({
      where: {
        id: chatbotId,
      },
      data: {
        HelpDesk: {
          delete: {
            id: helpDiskId,
          },
        },
      },
      select: {
        HelpDesk: true,
      },
    });
    if (!createdChatbot) throw new Error("external error server !!");
    return {
      code: 200,
      message: "HelpDisk deleted with success",
      questions: createdChatbot.HelpDesk,
    };
    //eslint-disable-next-line
  } catch (err: any) {
    return { code: 500, message: err.message, questions: [] };
  }
};
