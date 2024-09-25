"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";
import { removePinecone } from "../files";

export const getAccountChatBots = async () => {
  try {
    const userClerk = await currentUser();
    if (!userClerk) throw new Error("user not found !!!");
    const chatbots = await db.chatBot.findMany({
      where: {
        User: {
          clerkId: userClerk.id ?? "",
        },
      },
      include: {
        leadFields: true, // لجلب حقول الـ Leads
        files: true, // لجلب الملفات المرتبطة
        queries: true, // لجلب الاستفسارات
        chatBotLeads: {
          include: {
            leadsData: true, // لجلب بيانات الـ LeadsData المرتبطة
          },
        },
        customer: {
          include: {
            chatRoom: {
              include: {
                message: true, // لجلب الرسائل المرتبطة بكل غرفة دردشة
              },
            },
          },
        },
        HelpDesk: true, // لجلب بيانات المساعدة
      },
    });
    console.log({ chatbots });
    return chatbots;
  } catch (err) {
    console.log({ err });
    return [];
  }
};

export const createChatBot = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 401, message: "Unauthorized: User not found" };
    }

    const dbUser = await db.user.findFirst({
      where: {
        clerkId: user.id,
      },
    });

    if (!dbUser) {
      return { status: 404, message: "User not found in the database" };
    }

    const chatbot = await db.chatBot.create({
      data: {
        userId: dbUser.id,
      },
      select:{
        id:true
      }
    });
    if (chatbot)
      await db.chatbotTheme.create({
        data: {
          chatbotId: chatbot.id,
        },
      });
    return { status: 200, chatbot };
  } catch (err) {
    console.error("Error creating chatbot:", err);
    return { status: 500, message: "Internal server error" };
  }
};

export const deleteChatbot = async (chatotId: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 401, message: "Unauthorized: User not found" };
    }

    const chatbot = await db.chatBot.findFirst({
      where: {
        id: chatotId,
        User: {
          clerkId: user.id,
        },
      },
    });
    if (!chatbot) {
      return { status: 401, message: "Chatbot not found !!!! " };
    }
    await db.chatBot.deleteMany({
      where: {
        id: chatotId,
        User: {
          clerkId: user.id,
        },
      },
    });
    await removePinecone(chatotId);
    return { status: 200, message: "Kouah Chatbot deleted with success" };
  } catch (err) {
    console.log({ err });
    return { status: 500, message: "Internal server error" };
  }
};

export const getChatBot = async (chatbotId: string) => {
  try {
    // const user = await currentUser();
    // if (!user) {
    //   return { status: 401, message: "Unauthorized: User not found" };
    // }

    const chatbot = await db.chatBot.findFirst({
      where: {
        id: chatbotId,
        // User: {
        //   clerkId: user.id,
        // },
      },
      include: {
        leadFields: true, // لجلب حقول الـ Leads
        files: true, // لجلب الملفات المرتبطة
        queries: true, // لجلب الاستفسارات
        chatBotLeads: {
          include: {
            leadsData: true, // لجلب بيانات الـ LeadsData المرتبطة
          },
        },
        customer: {
          include: {
            chatRoom: {
              include: {
                message: true, // لجلب الرسائل المرتبطة بكل غرفة دردشة
              },
            },
          },
        },
        HelpDesk: true, // لجلب بيانات المساعدة
      },
    });
    if (!chatbot) {
      return { status: 401, message: "Chatbot not found !!!! ", chatbot: null };
    }
    return {
      status: 200,
      message: "Kouah Chatbot deleted with success",
      chatbot,
    };
  } catch (err) {
    console.log({ err });
    return { status: 500, message: "Internal server error", chatbot: null };
  }
};
