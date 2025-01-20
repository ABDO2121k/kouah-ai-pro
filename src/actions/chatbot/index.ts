"use server";

import { db } from "@/lib/prisma";
import { removePinecone } from "../files";
import { checkUserLimits } from "../user";
import { getCurrentUserFromDb } from "../auth";

export const getAccountChatBots = async () => {
  try {
    const user = await getCurrentUserFromDb();
    if (!user) throw new Error("user not found !!!");
    const chatbots = await db.chatBot.findMany({
      where: {
        User: {
          id: user.id ?? "",
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
        ChatRoom: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            message: {
              orderBy: {
                createdAt: "asc",
              },
            }, // لجلب الرسائل المرتبطة بكل غرفة دردشة
          },
        },
        HelpDesk: true, // لجلب بيانات المساعدة
        User: {
          include: {
            subscription: true, // Include user billings
          },
        },
      },
    });
    // console.log({ chatbots });
    return chatbots;
  } catch (err) {
    console.log({ err });
    return [];
  }
};

export const createChatBot = async () => {
  try {
    const dbUser = await getCurrentUserFromDb();

    if (!dbUser) {
      return { status: 404, message: "User not found in the database" };
    }

    console.log("Database user ID:", dbUser.id);

    await checkUserLimits(dbUser.id, "create_chatbot");

    const chatbot = await db.chatBot.create({
      data: {
        userId: dbUser.id,
      },
      select: {
        id: true,
      },
    });

    if (chatbot) {
      await db.chatbotTheme.create({
        data: {
          chatbotId: chatbot.id,
        },
      });
    }

    return { status: 200, chatbot };
    //eslint-disable-next-line
  } catch (err: any) {
    console.error("Error creating chatbot:", err);
    return { status: 500, message: err.message };
  }
};

export const deleteChatbot = async (chatotId: string) => {
  try {
    const user = await getCurrentUserFromDb();
    if (!user) {
      return { status: 401, message: "Unauthorized: User not found" };
    }

    const chatbot = await db.chatBot.findFirst({
      where: {
        id: chatotId,
        User: {
          id: user.id,
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
          id: user.id,
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


    const chatbot = await db.chatBot.findFirst({
      where: {
        id: chatbotId,
       
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
        ChatRoom: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            message: {
              orderBy: {
                createdAt: "desc",
              },
            }, // لجلب الرسائل المرتبطة بكل غرفة دردشة
          },
        },
        HelpDesk: true, // لجلب بيانات المساعدة
        User: {
          include: {
            subscription: true, // Include user billings
          },
        },
      },
    });
    if (!chatbot) {
      return { status: 401, message: "Chatbot not found !!!! ", chatbot: null };
    }
    return {
      status: 200,
      message: "Kouah Chatbot retrieved successfully",
      chatbot,
    };
  } catch (err) {
    console.log({ err });
    return { status: 500, message: "Internal server error", chatbot: null };
  }
};
