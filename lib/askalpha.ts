import "server-only";
import type {
  ChatResponse,
  Conversation,
  ChatMessage,
  VideoRecord,
  DailyVolume,
} from "./types";

// Server-only client for the Ask Alpha FastAPI backend. The browser never calls
// this directly — it goes through the Next.js route handlers in app/api/*, which
// inject the authenticated user_id from the Supabase session.

const RAW_BASE = process.env.ASK_ALPHA_API_URL || "http://localhost:8000";
const BASE = RAW_BASE.replace(/\/+$/, ""); // strip trailing slash
const API = `${BASE}/v1`;

export class AskAlphaError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "AskAlphaError";
  }
}

async function request<T>(
  path: string,
  init: RequestInit & { timeoutMs?: number } = {},
): Promise<T> {
  const { timeoutMs = 120_000, ...rest } = init;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      ...rest,
      signal: controller.signal,
      cache: "no-store",
      headers: { "Content-Type": "application/json", ...(rest.headers || {}) },
    });
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === "AbortError") {
      throw new AskAlphaError("The backend took too long to respond.", 504);
    }
    throw new AskAlphaError(
      `Couldn't reach the Ask Alpha backend at ${BASE}. Is it running?`,
      502,
    );
  }
  clearTimeout(timer);

  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.detail) detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
    } catch {
      /* non-JSON error body */
    }
    throw new AskAlphaError(detail, res.status);
  }

  return (await res.json()) as T;
}

export function sendChat(body: {
  message: string;
  conversation_id?: string | null;
  user_id?: string | null;
  channel?: string;
}): Promise<ChatResponse> {
  return request<ChatResponse>("/chat", {
    method: "POST",
    body: JSON.stringify({ channel: "website", ...body }),
  });
}

export function listConversations(
  userId: string | null,
  limit = 50,
  offset = 0,
): Promise<Conversation[]> {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (userId) params.set("user_id", userId);
  return request<Conversation[]>(`/conversations?${params.toString()}`, { method: "GET" });
}

export function getConversation(id: string): Promise<Conversation> {
  return request<Conversation>(`/conversations/${id}`, { method: "GET" });
}

export function getMessages(conversationId: string, limit = 200): Promise<ChatMessage[]> {
  return request<ChatMessage[]>(
    `/conversations/${conversationId}/messages?limit=${limit}`,
    { method: "GET" },
  );
}

export function getVideo(videoId: string): Promise<VideoRecord> {
  return request<VideoRecord>(`/videos/${videoId}`, { method: "GET", timeoutMs: 20_000 });
}

/**
 * Daily DLD volume for the welcome hook. Cached for an hour so the number is
 * stable within a day and only changes when fresh transaction data lands —
 * without re-querying the backend on every new chat.
 */
export async function getDailyVolume(): Promise<DailyVolume> {
  const res = await fetch(`${API}/market/daily-volume`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new AskAlphaError(`daily-volume ${res.status}`, res.status);
  return (await res.json()) as DailyVolume;
}
