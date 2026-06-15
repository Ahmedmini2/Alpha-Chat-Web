// Client-side wrappers around our Next.js API proxy routes (app/api/*).
import type {
  ChatResponse,
  Conversation,
  ChatMessage,
  VideoRecord,
  DailyVolume,
} from "./types";

async function asError(res: Response): Promise<never> {
  let msg = `Request failed (${res.status})`;
  try {
    const body = await res.json();
    if (body?.error) msg = body.error;
  } catch {
    /* ignore */
  }
  throw new Error(msg);
}

export async function fetchConversations(): Promise<Conversation[]> {
  const res = await fetch("/api/conversations", { cache: "no-store" });
  if (!res.ok) return asError(res);
  return res.json();
}

export async function fetchMessages(conversationId: string): Promise<ChatMessage[]> {
  const res = await fetch(`/api/conversations/${conversationId}/messages`, { cache: "no-store" });
  if (!res.ok) return asError(res);
  return res.json();
}

export async function postChat(body: {
  message: string;
  conversation_id: string | null;
}): Promise<ChatResponse> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) return asError(res);
  return res.json();
}

export async function fetchVideoStatus(id: string): Promise<VideoRecord> {
  const res = await fetch(`/api/videos/${id}`, { cache: "no-store" });
  if (!res.ok) return asError(res);
  return res.json();
}

export async function fetchDailyVolume(): Promise<DailyVolume> {
  const res = await fetch("/api/market/daily-volume");
  if (!res.ok) return asError(res);
  return res.json();
}
