import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { listConversations, AskAlphaError } from "@/lib/askalpha";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
  const offset = Math.max(Number(searchParams.get("offset")) || 0, 0);

  try {
    const conversations = await listConversations(user.id, limit, offset);
    return NextResponse.json(conversations);
  } catch (err) {
    const status = err instanceof AskAlphaError ? err.status : 500;
    const msg = err instanceof Error ? err.message : "Failed to load conversations";
    return NextResponse.json({ error: msg }, { status });
  }
}
