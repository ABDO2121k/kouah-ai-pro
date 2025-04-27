import { NextResponse } from "next/server";
import { getChatBot } from "@/actions/chatbot";
import { chatAi } from "@/actions/ai";

export async function POST(
  req: Request,
  { params }: { params: { chatbotId: string } }
) {
  try {
    const { chatbotId } = params;

    if (!chatbotId) {
      return NextResponse.json(
        { error: "Chatbot ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { message, history } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const chatbotResponse = await getChatBot(chatbotId);

    if (chatbotResponse.status !== 200 || !chatbotResponse.chatbot) {
      return NextResponse.json(
        { error: "Failed to retrieve chatbot information" },
        { status: chatbotResponse.status || 500 }
      );
    }

    const chatbotName = chatbotResponse.chatbot.title || "Kouah AI Assistant";
    const description = chatbotResponse.chatbot.description || "";

    const response = await chatAi(
      chatbotId,
      message,
      chatbotName,
      description,
      history || [],
      false
    );
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in chat processing:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred during chat processing",
      },
      { status: 500 }
    );
  }
}

// export async function POST(
//     req: Request,
//     { params }: { params: { chatbotId: string } }
//   ) {
//     try {
//       const { chatbotId } = params;

//       if (!chatbotId) {
//         return NextResponse.json(
//           { error: "Chatbot ID is required" },
//           { status: 400 }
//         );
//       }

//       const response = await getChatBot(chatbotId);

//       if (response.status === 200) {
//         return NextResponse.json(
//           { description: response.chatbot?.description },
//           { status: 200 }
//         );
//       } else {
//         return NextResponse.json(
//           { message: response.message || "Failed to retrieve chatbot" },
//           { status: response.status || 500 }
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching chatbot:", error);
//       return NextResponse.json(
//         { error: "Internal server error" },
//         { status: 500 }
//       );
//     }
//   }
