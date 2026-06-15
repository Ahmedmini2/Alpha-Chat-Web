import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getDailyVolume, AskAlphaError } from "@/lib/askalpha";

export const runtime = "nodejs";

// Daily DLD volume for the chat welcome hook. Auth-gated (only shown to members);
// the upstream fetch is cached hourly so the number is stable within a day.
export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  try {
    const volume = await getDailyVolume();
    return NextResponse.json(volume);
  } catch (err) {
    const status = err instanceof AskAlphaError ? err.status : 500;
    return NextResponse.json({ error: "unavailable" }, { status });
  }
}
