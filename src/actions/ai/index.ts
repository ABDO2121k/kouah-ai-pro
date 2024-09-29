"use server";

import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAI } from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { db } from "@/lib/prisma";

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
  // vectoriser le message pour njibo l contenu li kayxhlo w n3tiwh l openai
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY_A,
  });
  // verctoriser and index ain db hhhhhh l3z
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
  const pineconeIndex = pinecone.Index("kouah-ai");
  // hadi kanjibo l vecteur b namespace dialha
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: chatbotId,
  });
  // w hadi kanxofo a9rab jawab w argtanii howa l3adad li anjibo dial a9rab b7al ila dran 4 anjobo a9rab 4 ajwiba
  const results = await vectorStore.similaritySearch(message, 4);
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY_A,
  });
  //promt part
  console.log(
    results.map((r: { pageContent: string }) => r.pageContent).join("\n\n")
  );
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0,
    stream: false,
    messages: [
      {
        role: "system",
        content: `
          You are a highly intelligent AI assistant powered by **Kouah AI**, a cutting-edge SaaS platform designed to integrate and customize chatbots for various user needs. **Kouah AI** specializes in adaptable chatbots for multiple scenarios such as commercial assistance, education, customer support, and more.

          **Kouah AI Overview:**
          - The platform allows for easy integration with websites using just two lines of code.
          - Chatbots can be trained with content from URLs, YouTube videos, PDF files, text files, CSVs, HTML, and other formats.
          - Users can personalize the chatbot’s appearance (colors, logo) and add custom help sections.
          - **Real-time chat functionality** is available, allowing the chatbot to escalate complex questions or support requests to human agents.

          Your primary responsibility as this chatbot is to adapt to the unique needs of the customer and provide context-based, coherent answers in **Markdown format**. You must reflect the given chatbot role, organization, and persona, tailoring your responses accordingly.

          **Important Customization Requirements:**
          1. **Chatbot Name**: The user will provide a custom name for you. Always respond with this name if asked "Who are you?" or similar questions.
          2. **Chatbot Role**: The user will define your role (e.g., Commercial Assistant, Teacher, Product Specialist, etc.), and you must modify your behavior and responses to fit that role.
          3. **User-Specific Adaptation**: You should fully adapt to the needs of the customer that created you. Each customer has specific requirements for their chatbot, which you need to meet.
          4. **Keyword for Human Escalation**: If the user is upset, asks for support, or requests to speak to a manager, you must include the keyword **{{online}}** in your response to trigger a potential switch to human support.

          **Handling User Queries:**
          - When a user asks for your identity (e.g., "Who are you?"), respond with the chatbot name provided by the user: " I am ${chatbotName} ready to assist you for any thing tha you want ".
          - If the user asks irrelevant or angry questions, add **{{online}}** to your answer to indicate escalation to human support.
          - If you're unsure of the answer, simply respond with: "Sorry, I couldn't find the answer." Do not attempt to fabricate information.

          **Chatbot Context Example:**
          Use the following context to guide your responses:
          - **Chatbot Name**: ${chatbotName}
          - **Chatbot Role & Customer Requirements**: ${description}

          **Example of Previous Conversation:**
          Use previous messages to maintain continuity. If no previous messages exist, assume this is the first message:
          \`\`\`
          ${
            prevChats &&
            prevChats.length > 0 &&
            prevChats
              .map((message) => {
                if (message.role === "user")
                  return "User: " + message.content + "\n";
                return "Assistant: " + message.content + "\n";
              })
              .join("")
          }
          \`\`\`

          **Additional Context from Kouah AI:**
          \`\`\`
          Kouah AI is a platform for chatbot integration across different use cases, such as commercial support, education, and customer service. The chatbot can be trained using data from URLs, PDFs, videos, and other formats. It can also escalate conversations to human agents when complex or sensitive queries arise.
          \`\`\`

          **Context:**
          \`\`\`
          ${results
            .map((r: { pageContent: string }) => r.pageContent)
            .join("\n\n")}
          \`\`\`
        `,
      },
      {
        role: "user",
        content: `Respond based on the provided context. If the user asks for your identity, always use the chatbot name provided by the user (${chatbotName}). For angry or support-related questions, add **{{online}}** to indicate escalation to human support.`,
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   const stream = OpenAIStream(response as any);
  //   return new StreamingTextResponse(stream);
  return response.choices[0].message.content;
};

export const chatWithBot = async (
  id: string,
  chat: { role: "assistant" | "user"; content: string }[],
  message: string
) => {
  try {
    const chatbot = await db.chatBot.findFirst({
      where: {
        id: id,
      },
    });
    if (!chatbot) throw new Error("chatbot not found !!!!!");
    await db.chatBot.update({
      where: {
        id,
      },
      data: {
        queriesNumber: {
          increment: 1,
        },
      },
    });

    const chatbotResponse = await chatAi(
      id,
      message,
      chatbot.title,
      chatbot.description,
      chat
    );
    return { status: 200, response: chatbotResponse };
    //eslint-disable-next-line
  } catch (err: any) {
    console.log({ err });
    return { message: err.message, isError: true, status: 500 };
  }
};
