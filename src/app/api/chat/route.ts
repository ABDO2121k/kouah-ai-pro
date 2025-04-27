import { chatAi } from "@/actions/ai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, message, title, description, chat } = body;

    const response = await chatAi(id, message, title, description, true, chat);

    return response;
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An error occurred",
      }),
      { status: 500 }
    );
  }
}
