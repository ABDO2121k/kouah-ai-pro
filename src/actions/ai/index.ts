"use server";

import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAI } from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { db } from "@/lib/prisma";
import { checkUserLimits } from "../user";

export const chatAi = async (
  chatbotId: string,
  message: string,
  chatbotName: string,
  description: string,
  prevChats?: {
    role: "assistant" | "user";
    content: string;
  }[]
) => {
  try {
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY_A,
    });
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const pineconeIndex = pinecone.Index("kouah-ai");
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      namespace: chatbotId,
    });
    const results = await vectorStore.similaritySearch(message, 7);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY_A,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0,
      stream: true,
      // messages: [
      //   {
      //     role: "system",
      //     content: `
      //       You are a highly intelligent AI assistant powered by **Kouah AI**, a cutting-edge SaaS platform designed to integrate and customize chatbots for various user needs. **Kouah AI** specializes in adaptable chatbots for multiple scenarios such as commercial assistance, education, customer support, and more.

      //       **Kouah AI Overview:**
      //       - The platform allows for easy integration with websites using just two lines of code.
      //       - Chatbots can be trained with content from URLs, YouTube videos, PDF files, text files, CSVs, HTML, and other formats.
      //       - Users can personalize the chatbot's appearance (colors, logo) and add custom help sections.
      //       - **Real-time chat functionality** is available, allowing the chatbot to escalate complex questions or support requests to human agents.

      //       Your primary responsibility as this chatbot is to adapt to the unique needs of the customer and provide context-based, coherent answers in **Markdown format**. You must reflect the given chatbot role, organization, and persona, tailoring your responses accordingly.

      //       **Critical Customization Requirements:**
      //       1. **Chatbot Name**: The user will provide a custom name for you. Always respond with this name if asked "Who are you?" or similar questions.
      //       2. **Chatbot Role**: The user will define your role (e.g., Commercial Assistant, Teacher, Product Specialist, etc.), and you must modify your behavior and responses to fit that role precisely.
      //       3. **User-Specific Adaptation**: You should fully adapt to the needs of the customer that created you. Each customer has specific requirements for their chatbot, which you need to meet without fail.
      //       4. **Keyword for Human Escalation**: You MUST include the keyword **{{online}}** in your response in the following situations:
      //          - If the user's question is unclear or ambiguous
      //          - If the user asks a question that seems unrelated to your role or the provided context
      //          - If the user's message appears nonsensical or lacks clear meaning
      //          - If the user expresses frustration or dissatisfaction
      //          - If the user explicitly requests to speak with a human, support agent, or manager
      //          - If you're uncertain about how to respond or feel the query is beyond your capabilities
      //          - If the user asks about sensitive topics or complex issues that require human intervention

      //       **Handling User Queries:**
      //       - When a user asks for your identity (e.g., "Who are you?"), respond with the chatbot name provided by the user: "I am ${chatbotName}, ready to assist you with anything you need."
      //       - For ANY situation mentioned in point 4 above, ALWAYS include **{{online}}** in your response. This is CRUCIAL and must not be overlooked.
      //       - If you're unsure of the answer, do not apologize. Instead, use the context provided to give the best possible response, or ask for clarification if needed, and include **{{online}}** in your response.
      //       - ALWAYS be aware of requests for human intervention, such as "I want to talk to a manager" or "Can I speak to a real person?". In these cases, ALWAYS include **{{online}}** in your response.

      //       **Chatbot Context Example:**
      //       Use the following context to guide your responses:
      //       - **Chatbot Name**: ${chatbotName}
      //       - **Chatbot Role & Customer Requirements**: ${description}

      //       **Example of Previous Conversation:**
      //       Use previous messages to maintain continuity. If no previous messages exist, assume this is the first message:
      //       \`\`\`
      //       ${
      //         prevChats &&
      //         prevChats.length > 0 &&
      //         prevChats
      //           .map((message) => {
      //             if (message.role === "user")
      //               return "User: " + message.content + "\n";
      //             return "Assistant: " + message.content + "\n";
      //           })
      //           .join("")
      //       }
      //       \`\`\`

      //       **Additional Context from Kouah AI:**
      //       \`\`\`
      //       Kouah AI is a platform for chatbot integration across different use cases, such as commercial support, education, and customer service. The chatbot can be trained using data from URLs, PDFs, videos, and other formats. It can also escalate conversations to human agents when complex or sensitive queries arise.
      //       \`\`\`

      //       ** Context:**
      //       \`\`\`
      //       ${results
      //         .map((r: { pageContent: string }) => r.pageContent)
      //         .join("\n\n")}
      //       \`\`\`

      //       **Contextual Response Guidelines:**
      //       The following context consists of an ordered list of sources. If you can find answers from the context, use the context to provide a long response. You MUST cite the context titles and source URLs strictly in Markdown format in your response (just if it has a url or source). If you cannot find the answer from the sources, use your knowledge to come up a reasonable answer and do not cite any sources. If the query asks to summarize the file or uploaded file, provide a summarization based on the provided sources. If the conversation involves casual talk or greetings, rely on your knowledge for an appropriate response.
      //     `,
      //   },
      //   {
      //     role: "system",
      //     content: `Respond based on the provided context and the previous messages that you have with the user, make the answer much bigger as you can. This context is crucial and should be your primary source of information. If the user asks for your identity, always use the chatbot name provided by the user (${chatbotName}). For angry or support-related questions, carefully assess the situation and ALWAYS add **{{online}}** if human intervention is requested or necessary. This includes any requests to speak with a manager, human, or support agent. Always strive to provide a helpful and relevant response based on the available information, but prioritize using the **{{online}}** tag when appropriate.`,
      //   },
      //   {
      //     role: "user",
      //     content: message,
      //   },
      // ],
      messages: [
        {
          role: "system",
          content: `
            You are an advanced multilingual AI assistant powered by a state-of-the-art SaaS platform specializing in building and customizing chatbots for diverse use cases. Your primary role is to adapt to the specific needs of each chatbot instance based on the provided data, role, and context. 
      
            **Key Functionalities:**
            - Seamlessly adapt to the chatbot's role, which can vary across industries such as customer support, education, e-commerce, healthcare, and more.
            - Leverage chat history and provided context to maintain coherent, contextually relevant conversations without asking for unnecessary clarifications.
            - Respond in the user's language, ensuring correct text direction for right-to-left languages like Arabic.
            - Use Markdown for structured and visually appealing responses.
      
            **Guidelines for Context-Aware Responses:**
            1. Always analyze previous messages and provided context to infer the required information.
            2. Avoid generic requests for more details unless the context is entirely unclear or missing.
            3. Expand responses meaningfully when asked for additional details, relying on both the chat history and general knowledge.
      
            **Multilingual and Directional Support:**
            - Automatically detect the user's language and respond in the same language.
            - Ensure proper text alignment and formatting for languages like Arabic (RTL).
      
            **Handling Historical Context:**
            - If the user's question refers to a previous query, infer the details from chat history to provide a cohesive and relevant answer.
            - Example:
              - User: "Who is John?"
              - Assistant: "John is a software engineer specializing in AI solutions."
              - User: "Tell me more about his projects."
              - Assistant: "John has worked on various AI-driven applications, including chatbot solutions and predictive analytics tools."
      
            **Escalation and Human Interaction:**
            - Include the **{{online}}** tag in your response if:
              - The user's query is unclear or requires human intervention.
              - The user explicitly requests to escalate to a human agent or manager.
              - The question involves sensitive or complex issues beyond your capabilities.
      
            **Role-Specific and Contextual Customization:**
            - Chatbot Name: Always use the name provided by the user for the chatbot (e.g., "I am ${chatbotName}, here to assist you.").
            - Role and Data: Adapt responses to align with the chatbot's defined role and the provided context or data sources.
      
            **Available Context:**
            \`\`\`
            ${results
              .map((r: { pageContent: string }) => r.pageContent)
              .join("\n\n")}
            \`\`\`
      
            **Response Format:**
            - Provide detailed, contextually relevant, and well-structured responses.
            - Cite sources in Markdown format when applicable.
            - For casual conversations, rely on general knowledge while maintaining a friendly tone.
      
            Your mission is to deliver a highly adaptable, intelligent, and context-aware conversational experience, regardless of the chatbot's role or the user query. Always prioritize using the provided context and history to craft responses.
          `,
        },
        {
          role: "system",
          content: `
            Respond based on the provided context and chat history. Ensure your responses are accurate, multilingual, and align with the chatbot's defined role and purpose. Use Markdown for formatting and maintain consistency in tone and style.
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });
    //eslint-disable-next-line
    const stream = OpenAIStream(response as any);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Chat AI Error:", error);
    throw new Error(
      error instanceof Error ? error.message : "An error occurred during chat"
    );
  }
};

export const chatWithBot = async (
  id: string,
  chat: { role: "assistant" | "user"; content: string }[],
  message: string,
  roomId?: string
) => {
  try {
    const chatbot = await db.chatBot.findFirst({
      where: { id },
      include: {
        User: {
          include: {
            subscription: true,
          },
        },
      },
    });

    if (!chatbot) throw new Error("Chatbot not found!");

    // Check query limit
    try {
      await checkUserLimits(chatbot?.User?.id ?? "", "query");
      //eslint-disable-next-line
    } catch (limitError: any) {
      return { message: limitError.message, isBillingError: true, status: 403 };
    }

    // Increment query counts before streaming
    await db.chatBot.update({
      where: { id },
      data: {
        queriesNumber: { increment: 1 },
      },
    });

    if (chatbot.User?.subscription) {
      await db.billings.update({
        where: {
          id: chatbot.User.subscription.id,
        },
        data: {
          queriesNumber: { increment: 1 },
        },
      });
    }

    return {
      status: 200,
      chatbotInfo: {
        id,
        title: chatbot.title,
        description: chatbot.description,
        chat,
        message,
      },
    };
  } catch (err) {
    console.error("Chat With Bot Error:", err);
    return {
      message: err instanceof Error ? err.message : "An error occurred",
      isError: true,
      status: 500,
    };
  }
};

export const addMessagesToChatRoom = async (
  roomId: string,
  messages: { role: "assistant" | "user"; content: string; isImage?: boolean }[]
) => {
  try {
    const chatRoom = await db.chatRoom.findUnique({
      where: { id: roomId },
    });

    if (!chatRoom) {
      throw new Error("Chat room not found");
    }

    await db.chatRoom.update({
      where: { id: roomId },
      data: {
        chatRead: false,
        message: {
          createMany: {
            data: messages.map((msg) => ({
              message: msg.content,
              role: msg.role,
              isImage: msg.isImage ?? false,
            })),
          },
        },
      },
    });

    return { status: 200, message: "Messages added to chat room successfully" };
    //eslint-disable-next-line
  } catch (err: any) {
    console.error({ err });
    return { message: err.message, isError: true, status: 500 };
  }
};

export const createChatRoom = async (
  chatbotId: string,
  email: string,
  onChats: { role: "assistant" | "user"; content: string }[],
  type: "history" | "live"
) => {
  try {
    const chatbot = await db.chatBot.findFirst({
      where: {
        id: chatbotId,
      },
      include: {
        User: true,
      },
    });
    if (!chatbot) throw new Error("Chatbot not found!");

    // if (type === "live") {
    //   await checkUserLimits(chatbot?.User?.id??"", "create_chatbot");
    // }

    const existingChatRoom = await db.chatRoom.findFirst({
      where: {
        email: email,
        chatBotId: chatbotId,
      },
      include: {
        message: true,
      },
    });

    if (existingChatRoom) {
      // Add new messages to existing chat room
      const updatedChatRoom = await db.chatRoom.update({
        where: {
          id: existingChatRoom.id,
        },
        data: {
          live: type !== "history",
          message: {
            createMany: {
              data: onChats.map((chat) => ({
                message: chat.content,
                role: chat.role,
              })),
            },
          },
        },
        include: {
          message: true,
        },
      });

      return {
        status: 200,
        message:
          type === "history"
            ? "your history was successfully retrieved"
            : "Messages added to existing chat room.",
        chatRoomId: updatedChatRoom.id,
        chatHistory: updatedChatRoom.message,
        mode: type !== "history",
      };
    } else {
      if (type === "history") {
        throw new Error("history not found for this email !!!!!!");
      }
      // Create new chat room
      const newChatRoom = await db.chatRoom.create({
        data: {
          email: email,
          chatBotId: chatbotId,
          live: type === "live",
          message: {
            createMany: {
              data: onChats.map((chat) => ({
                message: chat.content,
                role: chat.role,
              })),
            },
          },
        },
        include: {
          message: true,
        },
      });

      return {
        status: 200,
        message: "New chat room created successfully.",
        chatRoomId: newChatRoom.id,
        mode: type === "live",
        chatHistory: newChatRoom.message,
      };
    }
    //eslint-disable-next-line
  } catch (err: any) {
    console.error({ err });
    return {
      message: err.message,
      isError: true,
      status: 500,
      chatRoomId: null,
      chatHistory: null,
      mode: false,
    };
  }
};

export const retrieveChatAndMakeItLive = async (
  chatbotId: string,
  chatRoomId: string
) => {
  try {
    const chatbot = await db.chatBot.findFirst({
      where: {
        id: chatbotId,
      },
    });
    if (!chatbot) throw new Error("Chatbot not found!");

    const existingChatRoom = await db.chatRoom.findFirst({
      where: {
        chatBotId: chatbotId,
        id: chatRoomId,
      },
      include: {
        message: true,
      },
    });

    if (!existingChatRoom) throw new Error("Chat room not found!");

    const updatedChatRoom = await db.chatRoom.update({
      where: {
        id: chatRoomId,
      },
      data: {
        live: !existingChatRoom.live,
      },
      include: {
        message: true,
      },
    });

    return {
      status: 200,
      message: `Chat room mode toggled successfully. New mode: ${
        updatedChatRoom.live ? "live" : "not live"
      }.`,
      chatRoomId: updatedChatRoom.id,
      chatHistory: updatedChatRoom.message,
      mode: updatedChatRoom.live,
    };
    //eslint-disable-next-line
  } catch (err: any) {
    console.error({ err });
    return {
      message: err.message,
      isError: true,
      status: 500,
      chatRoomId: null,
      chatHistory: null,
      mode: false,
    };
  }
};

export const makeRoomLive = async (roomId: string, mode: boolean) => {
  await db.chatRoom.update({
    where: {
      id: roomId,
    },
    data: {
      live: mode,
    },
  });
};

export const makeChatReadsTrue = async (roomId: string, value: boolean) => {
  await db.chatRoom.update({
    where: {
      id: roomId,
    },
    data: {
      chatRead: value,
    },
  });
};

export const addMessageToQueries = async (
  chatbotId: string,
  message: string,
  response: string
) => {
  await db.chatBot.update({
    where: {
      id: chatbotId,
    },
    data: {
      queries: {
        create: {
          query: message,
          answer: response ?? "",
        },
      },
    },
  });
};
