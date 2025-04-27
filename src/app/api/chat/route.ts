import { chatAi } from "@/actions/ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, message, title, description, chat } = body;

    const aiResponse = await chatAi(
      id,
      message,
      title,
      description,
      true,
      chat
    );

    if (aiResponse instanceof Response) {
      return aiResponse;
    }

    // If it's a string, create a proper Response object
    if (typeof aiResponse === "string") {
      return new Response(aiResponse, {
        headers: { "Content-Type": "text/plain" },
      });
    }

    if (aiResponse === null || aiResponse === undefined) {
      return NextResponse.json(
        { error: "No response generated" },
        { status: 404 }
      );
    }

    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error("Error in chat processing:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
