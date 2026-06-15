import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getConversation, getMessages, AskAlphaError } from "@/lib/askalpha";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Ownership check: the conversation must belong to the signed-in user.
    const conv = await getConversation(id);
    if (conv.user_id && conv.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const messages = await getMessages(id);
    return NextResponse.json(messages);
  } catch (err) {
    const status = err instanceof AskAlphaError ? err.status : 500;
    const msg = err instanceof Error ? err.message : "Failed to load messages";
    return NextResponse.json({ error: msg }, { status });
  }
}
