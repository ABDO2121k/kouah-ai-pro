"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";

export const addLeadsData = async (
  chatbotId: string,
  values: {
    fieldName: string;
    value: string;
  }[]
) => {
  try {
    const dbChatbot = await db.chatBot.findFirst({
      where: {
        id: chatbotId,
      },
    });
    if (!dbChatbot) {
      throw new Error("Chatbot not found or you don't have access to it.");
    }
    const created = await db.chatBotLeads.create({
      data: {
        chatBotId: chatbotId,
        leadsData: {
          create: values.map((field) => ({
            fieldName: field.fieldName,
            value: field.value,
          })),
        },
      },
    });
    return {
      code: 200,
      message:
        "Thank you for providing your information. We've successfully recorded your lead data.",
      data: created,
    };
    //eslint-disable-next-line
  } catch (err: any) {
    console.log({ err });
    return { code: 500, message: err?.message, created: {} };
  }
};

export const createLeadFields = async (
  chatbotId: string,
  leadsTitle: string,
  fields: {
    fieldName: string;
    required: boolean;
  }[]
) => {
  try {
    const userClerk = await currentUser();
    if (!userClerk) throw new Error("user not found !!!");
    const dbChatbot = await db.chatBot.findFirst({
      where: {
        id: chatbotId,
        User: {
          clerkId: userClerk.id,
        },
      },
    });
    if (!dbChatbot) {
      throw new Error("Chatbot not found or you don't have access to it.");
    }
    const created = await db.chatBot.update({
      where: { id: chatbotId },
      data: {
        leadsTitle: leadsTitle,
        leadFields: {
          deleteMany: {},
          create: fields.map((field) => ({
            fieldName: field.fieldName,
            required: field.required,
          })),
        },
      },
    });
    return {
      code: 200,
      message: "Lead fields have been successfully created.",
      data: created,
    };
    //eslint-disable-next-line
  } catch (err: any) {
    console.log({ err });
    return { code: 500, message: err?.message, created: {} };
  }
};
