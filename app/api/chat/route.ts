import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { sendChat, AskAlphaError } from "@/lib/askalpha";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: { message?: unknown; conversation_id?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }
  if (message.length > 4000) {
    return NextResponse.json({ error: "Message is too long (max 4000 characters)" }, { status: 400 });
  }
  const conversationId =
    typeof body.conversation_id === "string" && body.conversation_id ? body.conversation_id : null;

  try {
    // user_id comes from the validated session — never from the client.
    const result = await sendChat({
      message,
      conversation_id: conversationId,
      user_id: user.id,
      channel: "website",
    });
    return NextResponse.json(result);
  } catch (err) {
    const status = err instanceof AskAlphaError ? err.status : 500;
    const msg = err instanceof Error ? err.message : "Chat failed";
    return NextResponse.json({ error: msg }, { status });
  }
}
